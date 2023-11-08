using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace NeuronBack.Helpers
{
    public class EmailHelper
    {
        public bool SendEmail(string userEmail, string confirmationLink)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("neuronhorizonzero@gmail.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Confirm your email";
            mailMessage.IsBodyHtml = true;
            mailMessage.BodyEncoding = Encoding.UTF8;
            mailMessage.Body = "This is confirmation link: <br>" + "<a href="+confirmationLink+">Click here for nudes" + "</a>" + "<br> Trust me you should click it! ;)";

            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("neuronhorizonzero@gmail.com", "bnrb fqom jtzj whhq");
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.EnableSsl = true;

            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                // log exception
                Console.WriteLine(ex.ToString());
            }
            return false;
        }
    }
}
