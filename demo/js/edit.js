/*
Arduboy Web-based bitmap editor

Copyright (c) 2016 emutyworks

Released under the MIT license
https://github.com/emutyworks/BitmapEditor/blob/master/LICENSE.txt
*/
function edit_invert(){
  var mes = 'invert';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    for(var y = 0; y < view_h; y++){
      for(var x = 0; x < view_w; x++){
        var dx = x + view_x;
        var dy = y + view_y;
        try{
          var bw = edit_clip[y][x];
          if(bw == 1){
            bw = 0;
          }else{
            bw = 1;
          }
          set_bw(dx, dy, bw);
        }catch(e){}
      }
    }
  }
  edit_exit();
}

function edit_counter_clockwize(){
  var mes = 'counter clockwize';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    for(var y = 0; y < view_h; y++){
      var dy = view_y - 1;
      for(var x = view_w; x >= 0; x--){
        var bw = edit_clip[y][x];
        set_bw(view_x + y,dy, bw);
        dy++;
      }
    }
  }
  edit_exit();
}

function edit_clockwize(){
  var mes = 'clockwize';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    var dx = view_x + view_h - 1
    for(var y = 0; y < view_h; y++){
      for(var x = 0; x < view_w; x++){
        var bw = edit_clip[y][x];
        set_bw(dx,view_y + x, bw);
      }
      dx--;
    }
  }
  edit_exit();
}

function edit_half_turn(){
  var mes = 'half turn';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    var y = 0;
    for(var dy = view_h - 1; dy >= 0; dy--){
      var dx = view_x + view_w - 1;
      for(var x = 0; x < view_w; x++){
        var bw = edit_clip[y][x];
        set_bw(dx, view_y + dy, bw);
        dx--;
      }
      y++;
    }
  }
  edit_exit();
}

function edit_horisonal(){
  var mes = 'horisonal';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    var dx = view_x + view_w - 1;
    for(var x = 0; x < view_w; x++){
      for(var y = 0; y < view_h; y++){
        var bw = edit_clip[y][x];
        set_bw(dx, view_y + y, bw);
      }
      dx--;
    }
  }
  edit_exit();
}

function edit_vertical(){
  var mes = 'vertical';
  var flag = edit_confirm(mes);

  if(flag){    
    var view_x = cur_info['view_x'];
    var view_y = cur_info['view_y'];
    var view_w = cur_info['view_w'];
    var view_h = cur_info['view_h'];

    var dy = view_y + view_h - 1;  
    for(var y = 0; y < view_h; y++){
      for(var x = 0; x < view_w; x++){
        var bw = edit_clip[y][x];
        set_bw(view_x + x, dy, bw);
      }
      dy--;
    }
  }
  edit_exit();
}

function edit_paste(){
  var mes = 'paste';

  if(!check_select_area()){
    set_edit_mes('no_rect_paste');
    return;
  }

  var flag = true;
  if(edit_alert){
    flag = edit_confirm_alert(mes);
  }

  if(flag){
    paste_edit_clip();
  }
  edit_exit();
}

function set_merge_paste(){
  if($('#merge_paste').prop('checked')){
    merge_paste = true;
  }else{
    merge_paste = false;
  }
}

function edit_copy(){
  if(!check_select_area()){
    set_edit_mes('no_rect_copy');
    return;
  }
  edit_exit();
}

function edit_cut(){
  var mes = 'cut';

  if(!check_select_area()){
    set_edit_mes('no_rect_paste');
    return;
  }

  var flag = true;
  if(edit_alert){
    flag = edit_confirm_alert(mes);
  }

  if(flag){
    if(check_select_area() == 'edit'){
      var view_x = cur_info['view_x'];
      var view_y = cur_info['view_y'];
      var view_w = cur_info['view_w'];
      var view_h = cur_info['view_h'];

      for(var y = 0; y < view_h; y++){
        for(var x = 0; x < view_w; x++){
          var dx = x + view_x;
          var dy = y + view_y;
          set_bw(dx, dy, 0);
        }
      }
    }else if(check_select_area() == 'clip'){
      var c_clip_x = cur_info['c_view_x'];
      var c_clip_y = cur_info['c_view_y'];
      var c_clip_w = cur_info['c_view_w'];
      var c_clip_h = cur_info['c_view_h'];

      for(var y = 0; y < c_clip_h; y++){
        for(var x = 0; x < (c_clip_w * 8); x++){
          var p = (x + c_clip_x * 8) + ((y + c_clip_y) * CLIP_MAX_X * 8);
          clipboard[p] = '0x00';
        }
      }
    }
  }
  edit_exit();
}

function edit_cancel(){
  edit_exit();
}

function edit_exit(){
  del_cur_all();
  cur_info['rect'] = false;
  cur_info['c_rect'] = false;
  redraw_editor();
}

function edit_confirm(mes){
  if(!cur_info['rect']){
    set_edit_mes('no_rect');
    return false;
  }

  var flag = true;
  if(edit_alert){
    flag = edit_confirm_alert(mes);
  }
  return flag;
}

function edit_confirm_alert(mes){
  return window.confirm('Do you ' + mes + ' it?');
}

function set_edit_alert(){
  if($('#edit_alert').prop('checked')){
    edit_alert = false;
  }else{
    edit_alert = true;
  }
}
