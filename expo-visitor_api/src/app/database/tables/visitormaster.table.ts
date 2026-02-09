import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from "sequelize-typescript";
import { Int_VisitorMaster } from "src/app/models";
import { TABLE_INDEX, TABLE_NAMES } from "../constant";

@Table({
    tableName: TABLE_NAMES.VISITOR_MASTER,
    modelName: "VisitorMasterTable",
    timestamps: true,
    paranoid: false,
    initialAutoIncrement: TABLE_INDEX.VISITOR_MASTER,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
})
export class VisitorMasterTable extends Model<Int_VisitorMaster> {
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
        type: DataType.STRING(150),
        allowNull: false,
    })
    FullName: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    EmailAddress: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    PhoneNumber: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    CompanyName: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    Designation: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    City: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
    })
    AreaOfInterest: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    PurposeOfVisit: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    AdditionalComment: string;

    @Column({
        type: DataType.STRING(500),
        allowNull: true,
    })
    ImagePath: string;

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
