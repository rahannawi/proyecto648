using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NetInventory.API.Migrations
{
    /// <inheritdoc />
    public partial class MakeEquipmentIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Equipments_EquipmentId",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "EquipmentId",
                table: "Reviews",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Equipments_EquipmentId",
                table: "Reviews",
                column: "EquipmentId",
                principalTable: "Equipments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Equipments_EquipmentId",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "EquipmentId",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Equipments_EquipmentId",
                table: "Reviews",
                column: "EquipmentId",
                principalTable: "Equipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
