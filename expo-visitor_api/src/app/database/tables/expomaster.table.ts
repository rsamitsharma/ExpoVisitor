import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from "sequelize-typescript";

import { Int_ExpoMaster } from "src/app/models";
import { TABLE_NAMES, TABLE_INDEX } from "../constant";

@Table({
    tableName: TABLE_NAMES.EXPO_MASTER,
    modelName: "ExpoMasterTable",
    timestamps: true,
    paranoid: false,
    initialAutoIncrement: TABLE_INDEX.EXPO_MASTER,
    createdAt: "CreatedDate",
    updatedAt: "UpdatedDate",
})
export class ExpoMasterTable extends Model<Int_ExpoMaster> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RID: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    ExpoName: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    StartDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    EndDate: Date;

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
