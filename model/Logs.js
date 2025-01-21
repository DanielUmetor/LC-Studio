import { connection as db } from '../config/index.js'

class Logs{
    static fetchLogs(req,res){
        try{
            const strQry = `
            select user_id, attendance_id, concat(substring(created_at,1, 10), " " ,substring(created_at,12, 5))'Time Stamp', first_name, last_name, department 
              from Attendance left join Users using (user_id) 
              order by attendance_id desc ;
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

    static fetchUserStatus(req, res) {
        try {
          const strQry = `
          select distinct concat(first_name, " ", last_name) 'Full Name', department, user_id , concat(substring(created_at,1, 10), " " ,substring(created_at,12, 5))'Latest Log', 
                CASE 
                WHEN COUNT(*) % 2 = 0 THEN 'Off-Site'
                ELSE 'On-site'
              END AS status
          from Attendance left join Users using (user_id) group by user_id 
          order by attendance_id desc;
          `
          db.query(strQry, (err, results) => {
            if(err) throw err
            res.json({
              status: res.statusCode,
              results
            })
          })
        } catch (error) {
          res.json({
            status: 404,
            error
          })
        }
    }
    
    static addLog(req,res){
        try {
            const strQry = `
                insert into Attendance(user_id) 
                value(${req.params.uid});
            `

            db.query(strQry, (err,result) => {
                if (err) throw new err
                    res.json({
                        status: res.statusCode,
                        msg: "Scanned successfully😉",
                        result
                    }) 
            })
            
        } catch (error) {
            if(error){
                res.json({
                    status: 404,
                    result : `Couldn't find data`
                }) 
            }
        }
    }
    
    static fetchSingleUserLog(req,res){
        try {
          const strQry = `
          select user_id, attendance_id, concat(substring(created_at,1, 10), " " ,substring(created_at,12, 5))'Time Stamp', first_name, last_name, department 
          from Attendance left join Users using (user_id) 
          WHERE user_id = ${req.params.id} 
          order by attendance_id desc ;
          `
  
          db.query(strQry, (err, result)=>{
            if (err) throw new err 
              res.json({
                status : result.statusCode,
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
    Logs
}