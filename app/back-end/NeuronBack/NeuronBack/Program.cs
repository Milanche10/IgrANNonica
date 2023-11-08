using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
//using NeuronBack.Services.UserService;
using NeuronBack.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Microsoft.Extensions.FileProviders;
using NeuronBack.Helpers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.AspNetCore.Server.Kestrel.Core; 

var builder = WebApplication.CreateBuilder(args);
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";


builder.Services.AddSignalR();
// Add services to the container.
builder.Services.Configure<KestrelServerOptions>(builder.Configuration.GetSection("Kestrel"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//Vezano za citanje jwt tokena
//builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();
//----
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});


ConfigurationManager configuration = builder.Configuration;
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AuthenticationContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDefaultIdentity<ApplicationUser>().AddEntityFrameworkStores<AuthenticationContext>();
//builder.Services.AddTransient<AuthenticationContext>(); 
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4;
    //require email confirmication
    options.SignIn.RequireConfirmedEmail = true;
});

builder.Services.AddCors( options =>
    {
        options.AddPolicy(name: myAllowSpecificOrigins,
        builder =>
        {
            /*  builder
             .AllowAnyMethod()
             .AllowAnyHeader()
             .SetIsOriginAllowed(host=>true)
             .AllowCredentials();*/
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });

    });

builder.Services.AddControllersWithViews().AddNewtonsoftJson( 
    options => options.SerializerSettings.ReferenceLoopHandling =
    Newtonsoft.Json.ReferenceLoopHandling.Ignore).AddNewtonsoftJson(
    options => options.SerializerSettings.ContractResolver = new 
    DefaultContractResolver());


//Dodavanje sesije
//Dodat je mali idletimeout zbog lakseg testiranja
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});


builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".NeuronHorizon.Session";
    options.IdleTimeout = TimeSpan.FromSeconds(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;

});


var key = Encoding.UTF8.GetBytes("1234567891234567");
builder.Services.AddAuthentication(x =>
 {
     x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
     x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
     x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
 }
).AddJwtBearer(x=>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = false;
    x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])) 
    };
});

var app = builder.Build();

/*
app.Use(async (ctx, next) =>
{
    await next();
    if (ctx.Response.ContentLength == 204)
    {
        ctx.Response.ContentLength = 0;
    }

});
*/
// automatsko kreiranje baze ukoliko ne postoji
using (var serviceScope = app.Services.GetService<IServiceScopeFactory>().CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<AuthenticationContext>();
    // liniju ispod otkomentarisati kad treba da se obrise cela baza
    //   context.Database.EnsureDeleted(); 
    context.Database.Migrate(); 
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthentication();
//app.UseHttpsRedirection(); 
app.UseCors(myAllowSpecificOrigins);
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(new DirectoryInfo(Environment.CurrentDirectory).Parent.FullName, @"UsersData")),
    RequestPath = new PathString("/UsersData")
});
app.MapHub<Hubs>("/hub");
app.UseAuthorization();

//Koriscenje sesije
app.UseSession();

app.MapControllers();

app.Run();