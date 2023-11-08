using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuronBack.Migrations
{
    public partial class UpdateExp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "Experiments",
                type: "longtext",
                nullable: false,
                collation: "utf8_unicode_ci");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "Experiments");
        }
    }
}
