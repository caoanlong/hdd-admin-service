const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const jwt = require('jwt-simple')
const secret = require('../config/secret')

const Sys_user = require('../model/Sys_user')
const Sys_role = require('../model/Sys_role')
const Sys_user_role = require('../model/Sys_user_role')

// 统一返回格式
let responseData
router.use((req, res, next) => {
	responseData = {
		code: 0,
		msg: '成功'
	}
	next()
})


/* 获取用户列表 */
router.get('/list', (req, res) => {
	let pageIndex = Number(req.query.pageIndex || 1)
	let pageSize = Number(req.query.pageSize || 10)
	let LoginName = req.query.LoginName
	let Name = req.query.Name
	pageIndex = Math.max( pageIndex, 1 )
	let offset = (pageIndex - 1) * pageSize
	let where
	if (LoginName || Name) {
		where = {
			$or: [
				{
					LoginName: {
						$like: '%' + LoginName + '%'
					},
					Name: {
						$like: '%' + Name + '%'
					}
				}
			]
		}
	} else {
		where = {}
	}
	Sys_user.findAndCountAll({
		where: where,
		offset: offset,
		limit: pageSize,
		order: [
			['CreateDate', 'DESC']
		]
	}).then(sys_users => {
		responseData.data = sys_users
		responseData.data.pageIndex = pageIndex
		responseData.data.pageSize = pageSize
		res.json(responseData)
	})
})

/* 获取用户详情 */
router.get('/info', (req, res) => {
	let User_ID = req.query.User_ID
	Sys_user.findById(User_ID, {
		include: [{
			model: Sys_role
		}]
	}).then(sys_user => {
		responseData.data = sys_user
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 添加用户 */
router.post('/add', (req, res) => {
	let Company_ID = req.body.Company_ID || ''
	let Organization_ID = req.body.Organization_ID || ''
	let LoginName = req.body.LoginName
	let Password = req.body.Password
	let PayPassword = req.body.PayPassword || ''
	let JobNo = req.body.JobNo
	let Name = req.body.Name
	let Sex = req.body.Sex
	let Email = req.body.Email
	let Phone = req.body.Phone
	let Mobile = req.body.Mobile
	let Type = req.body.Type
	let Photo = req.body.Photo || ''
	let PCID = req.body.PCID || ''
	let LoginFlag = req.body.LoginFlag
	let CreateBy = req.body.CreateBy || '1'
	let UpdateBy = req.body.UpdateBy || '1'
	let Remark = req.body.Remark || ''
	let sys_roles = req.body.sys_roles
	Sys_user.create({
		Company_ID,
		Organization_ID,
		LoginName,
		Password,
		PayPassword,
		JobNo,
		Name,
		Sex,
		Email,
		Phone,
		Mobile,
		Type,
		Photo,
		PCID,
		LoginFlag,
		CreateBy,
		UpdateBy,
		Remark
	}).then(sys_user => {
		for (let i = 0; i < sys_roles.length; i++) {
			Sys_user_role.create({
				user_id: sys_user.User_ID,
				role_id: sys_roles[i]
			})
		}
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 批量添加用户 */
router.post('/addmutip', (req, res) => {
	let users = req.body.users
	for (let i = 0; i < users.length; i++) {
		users[i].CreateBy = '1'
		users[i].UpdateBy = '1'
		users[i].Remark = ''
	}
	Sys_user.bulkCreate(users).then(sys_user => {
		res.json(responseData)
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 修改用户 */
router.post('/update', (req, res) => {
	let User_ID = req.body.User_ID
	let Company_ID = req.body.Company_ID || ''
	let Organization_ID = req.body.Organization_ID || ''
	let LoginName = req.body.LoginName
	let Password = req.body.Password
	let PayPassword = req.body.PayPassword || ''
	let JobNo = req.body.JobNo
	let Name = req.body.Name
	let Sex = req.body.Sex
	let Email = req.body.Email
	let Phone = req.body.Phone
	let Mobile = req.body.Mobile
	let Type = req.body.Type
	let Photo = req.body.Photo || ''
	let PCID = req.body.PCID || ''
	let LoginFlag = req.body.LoginFlag
	let CreateBy = req.body.CreateBy || '1'
	let UpdateBy = req.body.UpdateBy || '1'
	let Remark = req.body.Remark || ''
	let sys_roles = req.body.sys_roles || []
	Sys_user.update({
		Company_ID,
		Organization_ID,
		LoginName,
		Password,
		PayPassword,
		JobNo,
		Name,
		Sex,
		Email,
		Phone,
		Mobile,
		Type,
		Photo,
		PCID,
		LoginFlag,
		CreateBy,
		UpdateBy,
		Remark,
		UpdateDate: new Date()
	},{
		where: {
			User_ID
		}
	}).then(() => {
		Sys_user_role.destroy({
			where: {
				user_id: User_ID
			}
		}).then(() => {
			for (let i = 0; i < sys_roles.length; i++) {
				Sys_user_role.create({
					user_id: User_ID,
					role_id: sys_roles[i]
				})
			}
			res.json(responseData)
		})
	}).catch(err => {
		responseData.code = 100
		responseData.msg = '错误：' + err
		res.json(responseData)
	})
})

/* 删除用户 */
router.post('/delete', (req, res) => {
	let ids = req.body.ids
	Sys_user.destroy({
		where: {
			User_ID: {
				$in: ids
			}
		}
	}).then(() => {
		Sys_user_role.destroy({
			where: {
				user_id: {
					$in: ids
				}
			}
		}).then(() => {
			res.json(responseData)
		})
	})
})

module.exports = router