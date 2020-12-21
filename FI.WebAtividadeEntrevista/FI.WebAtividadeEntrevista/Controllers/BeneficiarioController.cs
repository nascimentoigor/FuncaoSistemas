using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public static bool IsCpf(string cpf)
        {
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;
            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            if (cpf.Length != 11)
                return false;
            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            if (digito == cpf.Substring(9, 2))
                return true;
            else
                return false;
            //return cpf.EndsWith(digito);
        }

        [HttpPost]
        public JsonResult Incluir(List<BeneficiarioModel> model)
        {
            var retorno = "";
            for (var i = 0; i < model.Count(); i++)
            {
                if (!IsCpf(model[i].CPF))
                {
                    Response.StatusCode = 400;
                    retorno = "O CPF: "+model[i].CPF+" do beneficiário informado é invalido";
                }
                BoCliente verificar = new BoCliente();
                bool existe = verificar.VerificarExistencia(model[i].CPF.Replace(".", "").Replace("-", ""));
                if (existe)
                {
                    Response.StatusCode = 400;
                    retorno = "O CPF: " + model[i].CPF + " do beneficiário em questão já está cadastrado";
                }               
                //if (!this.ModelState.IsValid)
                //{
                //    List<string> erros = (from item in ModelState.Values
                //                            from error in item.Errors
                //                            select error.ErrorMessage).ToList();

                //    Response.StatusCode = 400;
                //    retorno = string.Join(Environment.NewLine, erros);
                //}
                else
                {
                    BoBeneficiario bo = new BoBeneficiario();

                    model[i].Id = bo.Incluir(new Beneficiario()
                    {
                        Nome = model[i].Nome,
                        CPF = model[i].CPF.Replace(".", "").Replace("-", ""),
                        IdCliente = 0

                    });

                    retorno = "Sucesso";
                }
            }
            
            return Json(retorno);            
        }

        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Beneficiario()
                {
                    Id = model.Id,
                    Nome = model.Nome,
                    CPF = model.CPF,
                });
                               
                return Json("Cadastro alterado com sucesso");
            }
        }

        public JsonResult ListarBeneficiarios(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            List<Beneficiario> listbenef = new List<Beneficiario>();

            listbenef = bo.ListarBeneficiarios(id);

            return Json(listbenef);
        }

        public string AlterarIdCliente(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return "Error";
            }
            else
            {
                bo.AlterarIdCliente(new Beneficiario()
                {
                    IdCliente = id
                });

                return "Cadastro realizado com sucesso!";
            }
        }

        //[HttpGet]
        //public ActionResult Alterar(long id)
        //{
        //    BoBeneficiario bo = new BoBeneficiario();
        //    Beneficiario cliente = bo.Consultar(id);
        //    Models.BeneficiarioModel model = null;

        //    if (cliente != null)
        //    {
        //        model = new BeneficiarioModel()
        //        {
        //            Id = cliente.Id,
        //            CEP = cliente.CEP,
        //            Cidade = cliente.Cidade,
        //            Email = cliente.Email,
        //            Estado = cliente.Estado,
        //            Logradouro = cliente.Logradouro,
        //            Nacionalidade = cliente.Nacionalidade,
        //            Nome = cliente.Nome,
        //            Sobrenome = cliente.Sobrenome,
        //            CPF = cliente.CPF,
        //            Telefone = cliente.Telefone
        //        };


        //    }

        //    return View(model);
        //}

        //[HttpPost]
        //public JsonResult BeneficiariosList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        //{
        //    try
        //    {
        //        int qtd = 0;
        //        string campo = string.Empty;
        //        string crescente = string.Empty;
        //        string[] array = jtSorting.Split(' ');

        //        if (array.Length > 0)
        //            campo = array[0];

        //        if (array.Length > 1)
        //            crescente = array[1];

        //        List<Beneficiario> clientes = new BoBeneficiario().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

        //        //Return result to jTable
        //        return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { Result = "ERROR", Message = ex.Message });
        //    }
        //}
    }
}