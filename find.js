const fs =require('fs');

const buf= fs.readFileSync('./phone.dat');

const index_offset = buf.readInt32LE(4, 4);
const size = (buf.length  - index_offset)/9;
const op_map= [
    '异常',
    '移动',//1
    '联通',//2
    '电信',//3
    '电信虚拟运营商',//4
    '联通虚拟运营商',//5
    '移动虚拟运营商' //6
];



function formatResult( phone , op_type , content){

    var arr = (content || '||||').split('|');
    return {
        phone :phone , 
        op: op_map[op_type], 
        province: arr[0],  
        city: arr[1],  
        zip_code: arr[2],  
        area_code: arr[3] 
    }

}

function find(phone_ori){
    var phone = parseInt( (phone_ori+'').substr(0,7) );
    var i =0;

    var left =0, right = size-1;

    while( left <= right  ){
        
        var pos =  Math.floor((right + left)/2); 
       
        var index = buf.readInt32LE(index_offset + pos*9 , 4);
        if(index < phone ){
            if( left === pos  ){
                return formatResult(phone_ori, 0 , null);
            }
            left = pos ;
        }else if (index > phone){
            if(right === pos){
                return formatResult(phone_ori, 0 , null);
            }
            right = pos;
        }else {
            // match 
            var info_offset = buf.readInt32LE(index_offset+pos*9+4,4);
            var phone_type = buf.readInt8(index_offset+pos*9+8, 1);
            var content = buf.slice(info_offset, info_offset+ 100);
            var end_idx = 0;
            while(end_idx <100 && content[end_idx] != "\n"){
                    end_idx ++;
            }
            //console.log('find', phone , content.toString('utf8', 0 , end_idx),phone_type, info_offset, end_idx);
            return formatResult(phone_ori, phone_type , content.toString('utf8', 0 , end_idx));
        }
    }
}

module.exports = find;
