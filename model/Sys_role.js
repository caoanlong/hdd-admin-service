const Sequelize = require('Sequelize')
const sequelize = require('./sequelize')

/* 系统权限角色 */
const Sys_role = sequelize.define('sys_role', {
	// 编号
	Role_ID: {
		type: Sequelize.BIGINT(32),
		primaryKey: true,
		allowNull: false
	},
	// 归属机构
	Organization_ID: {
		type: Sequelize.BIGINT(32)
	},
	// 角色名称
	Name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	// 英文名称
	EnName: {
		type: Sequelize.STRING(100)
	},
	// 权限类型
	RoleType: {
		type: Sequelize.STRING(50)
	},
	// 数据范围
	DataScope: {
		type: Sequelize.CHAR(1)
	},
	// 是否系统数据
	Issys: {
		type: Sequelize.CHAR(1)
	},
	// 是否可用
	Useable: {
		type: Sequelize.CHAR(1)
	},
	// 创建者
	CreateBy: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 创建时间
	CreateDate: {
		type: Sequelize.DATEONLY,
		allowNull: false
	},
	// 更新者
	UpdateBy: {
		type: Sequelize.BIGINT(32),
		allowNull: false
	},
	// 更新时间
	UpdateDate: {
		type: Sequelize.DATEONLY,
		allowNull: false
	},
	// 备注信息
	Remark: {
		type: Sequelize.TEXT
	},
	// 删除标记
	DelFlag: {
		type: Sequelize.CHAR(1),
		allowNull: false
	}
})

module.exports = Sys_role
