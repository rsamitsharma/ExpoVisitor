import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from "sequelize-typescript";
import { Int_MailLog } from "src/app/models";
import { TABLE_INDEX, TABLE_NAMES } from "../constant";

@Table({
    tableName: TABLE_NAMES.MAIL_LOG,
    modelName: "MailLogTable",
    timestamps: true,
    paranoid: false,
    initialAutoIncrement: TABLE_INDEX.MAIL_LOG,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
})
export class MailLogTable extends Model<Int_MailLog> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RID: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    VisitorID: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    ExpoID: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    RecipientEmail: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
    })
    Subject: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    Body: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'Pending',
    })
    Status: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    SentDate: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    ErrorMessage: string;

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
