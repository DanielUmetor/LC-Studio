import { connection as db } from '../config/index.js'
import { createToken } from '../middleware/AuthenticateUser.js'
import { compare, hash } from 'bcrypt'

class Users{
    static fetchUsers(req,res){
        try{
            const strQry = `
            Select user_id, first_name, last_name, department from Users;
            `
            db.query(strQry, (err, results) => {
                if(err) throw err 
                res.json({
                    status: res.statusCode,
                    results})
            })
        } catch (e){
           res.json({
            status: 404,
            msg: e.message
           })
        }
    }

    numberChecker(req) {
      let num = 0
      for (let ind = 0; ind < 10; ind++) {
        for (let index = 0; index < req.params.id.length; index++) {
          if (req.params.id[index] == ind){
            num += 1
          }
        }
      
      }

      if (num === req.params.id.length) return true
    }

    
    static fetchUser(req, res) {
        try{

          
            if (this.numberChecker(req)) {
              const strQry = `
              Select user_id, first_name, last_name, department from Users
              where user_id = ${req.params.id}
            `
              db.query(strQry, (err, result) => {
                  if (err) throw new Error(err)
                      res.json({
                          status: res.statusCode,
                          result: result[0]
                      }) 
              })

            } else {
                return res.json({
                  status: 400,
                  msg: 'Invalid user id.'
                })
          }  
        } catch (e) {
            res.json({
                status: 404,
                msg: 'Please try again.'
            })
        }
    }
    
     static async registerUser(req, res) {
        try {
          let data = req.body;
          data.user_pass = await hash(data.user_pass, 12)
    
          let user = {
            email_add: data.email_add,
            user_pass: data.user_pass,
          };
    
          let strQry = `
                insert into  Monitoring
                set ?;
                `
          db.query(strQry, [data], (err) => {
            if (err) {
              res.json({
                status: res.statusCode,
                error: err.message,
              });
            } else {
              const token = createToken(user);
              res.json({
                token,
                msg: 'Registration Successful.',
              })
            }
          });
        } catch (e) {
          res.json({
            status: 404,
            msg: e.message,
          });
        }
      }
    
    static async login(req, res) {
        try {
          const { email_add, user_pass } = req.body;
    
          const strQry = `
                select monitor_id, user_id, email_add, user_pass, concat(first_name, " ", last_name) 'Full Name', department 
                FROM Monitoring LEFT JOIN Users using(user_id)
                where email_add = '${email_add}'                  
                `;
          db.query(strQry, async (err, result) => {
            if (err) throw new Error(err)
            if (!result?.length) {
              res.json({
                status: 401,
                msg: "Invalid email. Please provide a valid email or register.",
              })
            } else {

              const isValidPass = await compare(req.body.user_pass, result[0].user_pass)                
              
              if (isValidPass) {
                const token = createToken({
                  email_add,
                  user_pass,
                })
                res.json({
                  status: res.statusCode,
                  msg: "Login Successful.",
                  token,
                  result: result[0],
                })
              } else {
                res.json({
                  status: 401,
                  msg: "Invalid Password. Please input correct password or register.",
                })
              }
            }
          })
        } catch (e) {
          res.json({
            status: 404,
            msg: e.message,
          })
        }
      }
      
    static async updateAdmin(req,res){
        try{
            const strQry = `
            Update Monitoring Set ? Where user_id = ${req.params.id};            
            `
            if(req.body.user_pass){
                let n = req.body.user_pass
                req.body.user_pass = await hash(req.body.user_pass, 12)
                
            }
            db.query(strQry,[req.body], (err, result) => {
                if (err) throw new Error(err)
                    res.json({
                        status: res.statusCode,
                        result
                    }) 
            })
        } catch (e) {
            res.json({
                status: 404,
                msg: 'Failed to update.'
            })
        }
    }

    static async updateUser(req,res){
      try{
          const strQry = `
          Update Users Set ? Where user_id = ${req.params.id};            
          `
          db.query(strQry,[req.body], (err, result) => {
              if (err) throw new Error(err)
                  res.json({
                      status: res.statusCode,
                      result
                  }) 
          })
      } catch (e) {
          res.json({
              status: 404,
              msg: 'Failed to update.'
          })
      }
    }

    static deleteUser(req, res) {
      try {
        const strQry = `
        delete from Users where
        user_id = ${req.params.id} 
        `
        db.query(strQry, (err) => {
          if (err) throw new Error("An error occurred while deleting user. Please try again.")
            res.json({
              status: res.statusCode,
              msg: 'User deleted successfully.'
            })
        })
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message
        })
      }
    }

    static deleteAdmin(req, res) {
      try {
        const strQry = `
        delete from Monitoring where
        monitor_id = ${req.params.id} 
        `
        db.query(strQry, (err) => {
          if (err) throw new Error("An error occurred while deleting user. Please try again.")
            res.json({
              status: res.statusCode,
              msg: 'User deleted successfully.'
            })
        })
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message
        })
      }
    }

    // Monitors
    static fetchMonitors(req,res){
      try {
        const strQry = `
        SELECT monitor_id, user_id, email_add, user_pass, concat(first_name, " ", last_name) 'Full Name', department 
        FROM Monitoring LEFT JOIN Users using(user_id) 
        order by user_id desc;
        `

        db.query(strQry, (err, result) => {
          if (err) throw new err
            res.json({
              status : res.statusCode,
              result
            })
        })
      } catch (error) {
        res.json({
          status : 404,
          error
        })
      }
    }
}

  export {
    Users
  }