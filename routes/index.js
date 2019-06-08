var express = require('express');
var router = express.Router();
const {db} = require('../lib/log');
const mongoose = require('mongoose');
// const chalk = require('chalk');
const connectAddr = require('../lib/connect');
mongoose.connect(connectAddr, {useNewUrlParser: true});
//建立User表
const User = mongoose.model('UserInfo',
    {
        username: String,
        belongRoutes: Object,
    });
//建立资源表
const Resource = mongoose.model('SourceInfo', {
    resName: String,
    resRouter: Object
});

//建立角色表
const Role = mongoose.model('RoleInfo', {
    rolename: String,
    rolesource: [],
    routes: Object
})

/* GET home page. */
//添加资源
router.post('/addResource', (req, res, next) => {
    // const obj = new Object(req.body.resRouter);
    const ress = new Resource({
        resName: '法律法规删除',
        resRouter: {
            path: 'LawsDel',
            name: '5-3',
            meta: {
                title: '法律法规删除'
            },
            component: 'LawsDel'
        }
    });
    ress.save()
        .then(data => {
            console.log(data.resRouter.children)
        })
        .catch(err => Promise.reject(err))
    res.send('sus')
    // console.log(obj)
})
    //获取所有资源
    .post('/getAllResource', (req, res, next) => {
        Resource.find((err, docs) => {
            if (err) {
                return err;
            } else {
                res.send(docs)
            }
        })
    })
    //添加角色
    .post('/addRole', (req, res, next) => {

        const role = new Role({
            rolename: req.body.rolename,
            rolesource: req.body.rolesource,
            routes: req.body.routes
        })

        role.save()
            .then(data => {
                console.log(data);
                res.send({result: true});
            })
            .catch(err => Promise.reject(err));
    })
    //获取所有角色
    .post('/getAllRole', (req, res, next) => {
        Role.find((err, docs) => {
            res.send(docs)
        })
    })
    //添加用户
    .post('/addUser', (req, res, next) => {
        console.log(req.body.belongRoutes)
        const user = new User({
            username: req.body.username,
            belongRoutes: req.body.belongRoutes,
        })

        user.save()
            .then(data => {
                console.log(data)
                res.send('添加成功')
            })
            .catch(err => Promise.reject(err))
    })
    //根据角色名查找角色所带路由表
    .post('/findUserByName', (req, res, next) => {
        Role.find({rolename: req.body.username}, (err, docs) => {
            res.send(docs);
        })
    })
    //根据用户名查询用户所带路由表
    .post('/findRoutesByUser', (req, res, next) => {
        User.find({username: req.body.username}, (err, docs) => {
            res.send(docs)
        })
    })
    //删除角色
    .post('/delRole', (req, res, next) => {
        Role.deleteOne({rolename: req.body.rolename}, (err, docs) => {
            console.log(docs);
            res.send({result: true})
        })
    })
    //更新角色
    .post('/updateRole', (req, res, next) => {
        Role.updateOne({rolename: req.body.rolename}, {rolename: req.body.newname}, (err, docs) => {
            console.log(docs)
            res.send({result: true})
        })
    })
    .post('/updateUser',(req,res,next) => {
        User.updateOne({username:req.body.username},{
            belongRoutes:req.body.belongRoutes
        },(err,docs) => {
            console.log(docs)
            res.send({result:true})
        })
    })


module.exports = router;
