using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuronBack.Migrations
{
    public partial class CreateDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true, collation: "utf8_unicode_ci"),
                    NormalizedName = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: true, collation: "utf8_unicode_ci"),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    Discriminator = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    FullName = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    RefreshToken = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true, collation: "utf8_unicode_ci"),
                    NormalizedUserName = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: true, collation: "utf8_unicode_ci"),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true, collation: "utf8_unicode_ci"),
                    NormalizedEmail = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: true, collation: "utf8_unicode_ci"),
                    EmailConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    SecurityStamp = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    PhoneNumberConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "Experiments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false, collation: "utf8_unicode_ci"),
                    experimentName = table.Column<string>(type: "varchar(40)", maxLength: 40, nullable: true, collation: "utf8_unicode_ci"),
                    createDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    modifiedDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    currentModels = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    Inputs = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    Outputs = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experiments", x => x.id);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    experimentid = table.Column<int>(type: "int", nullable: false),
                    modelName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8_unicode_ci"),
                    createDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    lastModificationDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    path = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    modelIDInExperiment = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    modelProblemType = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    configuration = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci"),
                    trainingOnModel = table.Column<string>(type: "longtext", nullable: false, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.Id);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "refreshTokens",
                columns: table => new
                {
                    RefreshTokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    RefreshTokens = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refreshTokens", x => x.RefreshTokenId);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", maxLength: 85, nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", maxLength: 85, nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    ProviderKey = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    ProviderDisplayName = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci"),
                    UserId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    RoleId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    LoginProvider = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    Name = table.Column<string>(type: "varchar(85)", maxLength: 85, nullable: false, collation: "utf8_unicode_ci"),
                    Value = table.Column<string>(type: "longtext", nullable: true, collation: "utf8_unicode_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8_unicode_ci");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Experiments");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "refreshTokens");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
