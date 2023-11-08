using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuronBack.Migrations
{
    public partial class UpdateModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "trainTestJSON",
                table: "Models",
                type: "longtext",
                nullable: true,
                collation: "utf8_unicode_ci");

            migrationBuilder.AlterColumn<string>(
                name: "currentModels",
                table: "Experiments",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                collation: "utf8_unicode_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8_unicode_ci");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "trainTestJSON",
                table: "Models");

            migrationBuilder.AlterColumn<string>(
                name: "currentModels",
                table: "Experiments",
                type: "longtext",
                nullable: true,
                collation: "utf8_unicode_ci",
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .OldAnnotation("Relational:Collation", "utf8_unicode_ci");
        }
    }
}
