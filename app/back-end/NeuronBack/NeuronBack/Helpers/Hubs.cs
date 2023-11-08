using Microsoft.AspNetCore.SignalR;

namespace NeuronBack.Helpers
{

    public class Hubs : Hub
    {
        public static Dictionary<string, string> activeUsers = new Dictionary<string, string>();
        private IHubContext<Hubs> context;
        
        public Hubs(IHubContext<Hubs> context)
        {
            this.context = context;
        }

        public string GetConnectionId(string token)
        {
            activeUsers[token] = Context.ConnectionId;
            return Context.ConnectionId;
        }

        public void SendData(string connectionId, string data)
        {
            try
            {
                context.Clients.Client(connectionId).SendAsync("Data", data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
                
        }
    }
}
