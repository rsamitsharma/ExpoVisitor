import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from "sequelize-typescript";
import { Int_DocumentMaster } from "src/app/models";
import { TABLE_INDEX, TABLE_NAMES } from "../constant";

@Table({
    tableName: TABLE_NAMES.DOCUMENT_MASTER,
    modelName: "DocumentMasterTable",
    timestamps: true,
    paranoid: false,
    initialAutoIncrement: TABLE_INDEX.DOCUMENT_MASTER,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
})
export class DocumentMasterTable extends Model<Int_DocumentMaster> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RID: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    ExpoID: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    VisitorID: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    DocumentType: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    DocumentName: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
    })
    DocumentPath: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    IsActive: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    CreatedDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    UpdatedDate: Date;
}
