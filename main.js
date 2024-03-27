var submit = document.querySelector('.submit')
submit.addEventListener('click', read)

function read(){
    let startTime= new Date(document.querySelector('#start_time').value)
    startTime.setSeconds(startTime.getSeconds() + Math.floor(Math.random() * 60) + 1)
    let endTime = new Date(document.querySelector('#end_time').value)
    let printTime = new Date(document.querySelector('#print_time').value)
    printTime = covertTime(printTime)
    let device_name = document.querySelector('#device_name').value
    let failed_percent = document.querySelector('#failed_percent').value
    let  report_name = document.querySelector('#report_name').value
    let oj =   calTime(startTime,endTime)
    

    // Tạo header
    htmlsHeader = header(printTime,report_name , device_name, oj.numberPage)

    //Tạo content
    var ojContent = content(oj,failed_percent)
    var htmlsContent = ojContent.htmls

    //Tạo footer
    htmlsFooter = footer(oj.numberPage)

    // Tạo báo cáo chung

    var htmlsReport = report(ojContent.maxmin , printTime , device_name, report_name, oj.time, oj.numberMoment, oj.numberPage)

    

    // Render
    html = ''
    for(i =0 ; i < oj.numberPage ; i ++){
        html =html + htmlsHeader[i] + htmlsContent[i] + htmlsFooter[i]
    }
    
    html = html + htmlsReport

    document.querySelector("body").innerHTML = html
    }


    
 






function calTime(startTime,endTime){
    let array= []
    for(var i = 1 ; i < 3000; i ++) {
        startTime.setMinutes(startTime.getMinutes() + 1)
        if(startTime >= endTime ){
         break    
        }
        var time = covertTime(startTime)
        array.push(time)
    }
    let numberMoment = array.length
     let times = minuteToHour(numberMoment-1)
     if(numberMoment < 56) {
       var  numberPage = 1
     } else {  var numberPage = Math.floor(numberMoment/55) +1 }
  

    let oj = {
        listMoment: array,
        numberMoment:numberMoment,
        time: times,
        numberPage: numberPage
        
    }
    return oj
}




function covertTime(thoi_diem){
    var ngay = thoi_diem.getDate();
    var thang = thoi_diem.getMonth() + 1; 
    var nam = thoi_diem.getFullYear() % 100; 
    var gio = thoi_diem.getHours();
    var phut = thoi_diem.getMinutes();
    var giay = thoi_diem.getSeconds();
    ngay = ngay < 10 ? '0' + ngay : ngay;
    // thang = thang < 10 ? '0' + thang : thang;
    nam = nam < 10 ? '0' + nam : nam;
    gio = gio < 10 ? '0' + gio : gio;
    phut = phut < 10 ? '0' + phut : phut;
    giay = giay < 10 ? '0' + giay : giay;
    var buoi = gio >= 12 ? 'CH' : 'SA';
    if (gio > 12) {
        gio = gio - 12;
    }
    var thoi_gian = ngay +'/' + thang +'/20' + nam + ' ' + gio + ':' + phut + ':' + giay + ' ' + buoi;
    return thoi_gian
}

function minuteToHour(phut) {
    var gio = Math.floor(phut / 60);
    var phutConLai = phut % 60;
    if(gio < 10){gio =`0${gio}`}
    if(phut < 10 ){phut = `0${phut}`}
    return `${gio}:${phutConLai}:00`;
}



function header(printTime,report_name , device_name, numberPage){
  var htmls = []
    for(var i = 0 ; i < numberPage ; i++ ){
        var  html = `
        <div class="component">
        <header class="header">
            <div class="print-time">${printTime}</div>
            <div class="file-name">${report_name}</div>
            <div class="title">
                <div class="title-item">${device_name}</div>
                <div class="title-item">AirNet-310-4   </div>
                <div class="title-item">Normalized Counts</div>
            </div>
        </header>
        <div class="content-body">
            <table class="table">
                <thead>
                    <tr>
                        <td  class="row1 col1">Sample Time Stamp</td>
                        <td class="row1">Interval</td>
                        <td class="row1">cubic meters/Sample</td>
                        <td class="row1">cubic meters/Minute</td>
                        <td class="row1">Cumulative</td>
                        <td class="row1">0.300 microns</td>
                        <td class="row1">0.500 microns</td>
                        <td class="row1">1.000 microns</td>
                        <td class="row1">5.000 microns</td>
                    </tr>
                </thead>    
    
                <tbody class="table__body">
        `
        htmls.push(html)
    }
    return htmls
}


function content(oj ,failed_percent){
    // Tính toán giá trị trước 
    var numberPracticiles = []
    for(var i = 0 ; i < oj.numberMoment ; i ++ ){
        var element = []
        if(Math.random() < failed_percent/100){
        var element = taotieupha()
        } else {var element = [0,0,0] }
        numberPracticiles.push(element)
    }

    var maxmin = xulymang(numberPracticiles)

    var htmls = []
    for(var i = 0 ; i < oj.numberPage ; i ++ ){
       var html = ''
       for(var  j = i*55 ; j < i*55 +55 ; j ++ ){
           if(j == oj.numberMoment ) {break}
           
           html = html + `<tr>
           <td class="col1">${oj.listMoment[j]}</td>
           <td>60.00</td>
           <td>0.028</td>
           <td>0.028</td>
           <td>${numberPracticiles[j][0] + numberPracticiles[j][1] + numberPracticiles[j][2]}</td>
           <td>${numberPracticiles[j][0]}</td>
           <td>${numberPracticiles[j][1]}</td>
           <td>${numberPracticiles[j][2]}</td>
           <td>0</td>
       </tr>`
       if(j % 5 == 4  && j !=0 ){html = html +` <tr class="space"></tr>`}
       }
       htmls.push(html)
    }

     maxmin.timeMax = oj.listMoment[maxmin.indexMax]
     maxmin.timeMin = oj.listMoment[maxmin.indexMin]
     maxmin.startTime = oj.listMoment[0]
     maxmin.endTime = oj.listMoment[oj.listMoment.length-1]
    return {
        htmls: htmls,
        maxmin: maxmin,
    }

}


function footer(numberPage){
    var htmls = []
    for(var i = 0 ; i < numberPage ; i++ ){
        var  html = `
        </tbody>     
        </table>

    </div>

    <footer class="footer">
        <div class="status">
            <div class="invalid">Invalid Data</div>
            <div class="laser">Laser Error</div>
            <div class="alarm alarm0">Alarm Level 0</div>
            <div class="alarm alarm1">Alarm Level 1</div>
            <div class="alarm alarm2">Alarm Level 2</div>
            <div class="alarm alarm3">Alarm Level 3</div>

        </div>
        <div class="user-and-page">
            <div class="user">&lt;No User&gt;</div>
            <div class="page-number">Page ${i+1} of ${numberPage +1}</div>
        </div>
    </footer>
</div>
</body>
</html>
        `
        htmls.push(html)
    }
    return htmls
}


//  tạo ra số lượng tiểu phân

function chonGiaTriTuyY(tiLe) {
    var mang = [0, 71, 35, 141, 247, 318]
    // Tạo một số ngẫu nhiên từ 0 đến 100
    const ngauNhien = Math.random() * 100;
    let tongTiLe = 0;
  
    // Duyệt qua mảng tỉ lệ
    for (let i = 0; i < tiLe.length; i++) {
      tongTiLe += tiLe[i];
      if (ngauNhien < tongTiLe) {
        return mang[i];
      }
    }
    return mang[0];
  }
  
function taotieupha(){
  var parcticile0_3 = chonGiaTriTuyY([25, 25, 20, 15, 10,5])
  var parcticile0_5 = chonGiaTriTuyY([35, 30, 20, 10, 5, 0])
  var parcticile1_0 = chonGiaTriTuyY([70, 20, 10, 5, 0, 0])
  return [parcticile0_3,parcticile0_5,parcticile1_0]
}

  


// Hàm để tính tổng các phần tử trong một mảng
function tinhTong(mangCon) {
  return mangCon.reduce((tong, hienTai) => tong + hienTai, 0);
}

function xulymang(mang){
    let mangTong = mang.map(tinhTong);
    let tongLonNhat = Math.max(...mangTong);
    let tongNhoNhat = Math.min(...mangTong);
    let chiSoLonNhat = mangTong.indexOf(tongLonNhat);
    let chiSoNhoNhat = mangTong.indexOf(tongNhoNhat);
    return {
        max: tongLonNhat,
        indexMax: chiSoLonNhat,
        min: tongNhoNhat ,
        indexMin: chiSoNhoNhat
    }
}




function report(maxmin, printTime , device_name, report_name ,time , numberMoment ,numberPage){
    html = `
    <div class="component">
    <header class="header">
        <div class="print-time">${printTime}</div>
        <div class="file-name">${device_name}</div>
        <div class="title-report"> Statistics: ${maxmin.startTime} to ${maxmin.endTime}   </div>
    </header>
    <div class="content-report">
        <table class="table-report1">
            <tr>
                <td>Number Samples</td>
                <td>${numberMoment}</td>
            </tr>
            <tr>
                <td>Time Sampled</td>
                <td>${time}</td>
            </tr>
            <tr class="space"></tr>
            <tr>
                <td>Average(Mean)</td>
                <td>0</td>
            </tr>
            <tr class="space"></tr>
            <tr>
                <td>Minumum</td>
                <td>${maxmin.min}</td>
                <td>${maxmin.timeMin}</td>
            </tr>

            <tr>
                <td>Maximum</td>
                <td>${maxmin.max}</td>
                <td>${maxmin.timeMax}</td>
            </tr>
        </table>

        <table class="table-report2">
            <tr>
                <th>Alarm Typle</th>
                <th>Samples in Alarm</th>
                <th>Sample Time in Alarm</th>
                <th>Percent Time in Alarm</th>
            </tr>
            <tr>
                <td>Laser Error</td>
                <td>${numberMoment}</td>
                <td>${time}</td>
                <td>100%</td>
            </tr>
        </table>
        <h4>Filter: None</h4>
    </div>

    <footer class="footer">
        <div class="user-and-page">
            <div class="user">&lt;No User&gt;</div>
            <div class="page-number">Page ${numberPage+1} of ${numberPage+1} </div>
        </div>
    </footer>
</div>

    `

    return html
}