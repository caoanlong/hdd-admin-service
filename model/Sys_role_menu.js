const Sequelize = require('Sequelize')
const sequelize = require('./sequelize')

/* 权限角色与菜单关联 */
const Sys_role_menu = sequelize.define('sys_role_menu', {
	// // 角色编号
	role_id: {
		type: Sequelize.STRING(64),
		allowNull: false
	},
	// 菜单编号
	menu_id: {
		type: Sequelize.STRING(64),
		allowNull: false
	}
})

module.exports = Sys_role_menu

