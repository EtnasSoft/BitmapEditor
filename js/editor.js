/*
Arduboy Web-based bitmap editor

Copyright (c) 2016 emutyworks

Released under the MIT license
https://github.com/emutyworks/BitmapEditor/blob/master/LICENSE.txt
*/
function redraw_editor(){
  init_editor();
  set_data();

  redraw_clip();
}

function check_edit_area(){
  var x = cur_info['x'];
  var y = cur_info['y'];
  var dx = cur_info['dx'];
  var dy = cur_info['dy'];

  if(y >= 0 && x < CLIP_X && dx < MAX_PIXEL_X + 1 && dy < MAX_PIXEL_Y + 1){
     return true;
  }
  return false;
}

function view_edit_info(){
  var dx = ('000' + cur_info['dx']).slice(-3);
  var dy = ('000' + cur_info['dy']).slice(-3);
  var view_x = ('000' + cur_info['view_x']).slice(-3);
  var view_y = ('000' + cur_info['view_y']).slice(-3);
  var view_w = ('000' + cur_info['view_w']).slice(-3);
  var view_h = ('000' + cur_info['view_h']).slice(-3);

  $('#edit_info').html(
    '<span class="mono"> x:' + dx + " y:" + dy + "</span>" +
    ' <b>Cursor:</b> <span class="mono">x:' + view_x + " y:" + view_y +" w:" + view_w + ' h:' + view_h + "</span>"
  );
}

function change_edit_pixel(x,y){
  if(window.confirm('Data will be reset. Is it OK?')){
    MAX_PIXEL_X = x;
    MAX_PIXEL_Y = y;

    EDITOR_MAX_Y = (PRE_PIXEL_SIZE * 64) + EDITOR_MENU_SIZE + (64 * 8 * 10) + 1;

    if(MAX_PIXEL_X==128){
      PIXEL_SIZE = 8;
    }else if(MAX_PIXEL_Y==8){
      PIXEL_SIZE = 16;
    }else if(MAX_PIXEL_Y==16){
      PIXEL_SIZE = 16;
    }else if(MAX_PIXEL_Y==32){
      PIXEL_SIZE = 14;
    }else if(MAX_PIXEL_Y==64){
      PIXEL_SIZE = 10;
    }
    EDITOR_MENU_Y = PRE_PIXEL_SIZE * MAX_PIXEL_Y;
    EDITOR_MAIN_Y = EDITOR_MENU_Y + EDITOR_MENU_SIZE;

    init_edit_data();
    init_editor();

    redraw_clip();
  }
}

function change_bw(){
  if(check_edit_area()){
    var dx = cur_info['dx'];
    var dy = cur_info['dy'];
    var bw = get_d(dx,dy);
    
    if(bw == 1){
      set_bw(dx,dy,0);
    }else{
      set_bw(dx,dy,1);
    }
  }
}

function set_bw(dx,dy,bw){
  var x = dx + parseInt(dy / 8) * MAX_PIXEL_X;
  var y = dy % 8;

  if(MAX_PIXEL_X < dx + 1 || MAX_PIXEL_Y < dy + 1){
    return false;
  }

  if(bw==1){
    d[x] = '0x' + ('00' + parseInt((d[x] | set_w[y]),10).toString(16)).slice(-2);
    ctx.fillStyle = EDITOR_W;

  }else{
    d[x] = '0x' + ('00' + parseInt((d[x] & set_b[y]),10).toString(16)).slice(-2);
    ctx.fillStyle = EDITOR_B;
  
  }
  ctx.fillRect(dx * PIXEL_SIZE + 1, (dy * PIXEL_SIZE + 1) + EDITOR_MAIN_Y, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
  ctx.fillRect((dx * PRE_PIXEL_SIZE) + EDITOR_PRE_X + 1, (dy * PRE_PIXEL_SIZE) + EDITOR_PRE_Y + 1, PRE_PIXEL_SIZE, PRE_PIXEL_SIZE);
 }

function get_hx_str(){
  var hx_str = '';
  if(MAX_PIXEL_X == 8 || MAX_PIXEL_X == 16){
    hx_str = d.join(', ');
    hx_str += "\n";
  }else{
    for(var i = 0; i < (MAX_PIXEL_X * MAX_PIXEL_Y / 8 / 16); i++){
      var dx = i * 16;
      hx_str += 
        d[dx]+', '+d[dx+1]+', '+d[dx+2]+', '+d[dx+3]+', '+
        d[dx+4]+', '+d[dx+5]+', '+d[dx+6]+', '+d[dx+7]+', '+
        d[dx+8]+', '+d[dx+9]+', '+d[dx+10]+', '+d[dx+11]+', '+
        d[dx+12]+', '+d[dx+13]+', '+d[dx+14]+', '+d[dx+15]+",\n";
    }
  }
  return hx_str;
}

function set_editor_fillrect(x,y,w,h,color,alpha){
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
  ctx.globalAlpha = 1.0;
}

function set_editor_rect(x,y,w,h,color){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y, 1, h);
  ctx.fillRect(x + w, y, 1, h);
  ctx.fillRect(x, y + h, w + 1, 1);
}

/*
 * data
 */
function get_d(dx,dy){
  var x = dx + parseInt(dy / 8) * MAX_PIXEL_X;
  var y = dy % 8;
  return cnv16to2(d[x]).charAt(get_dy[y]);
}

function set_data(){
  var x = cur_info['view_x'];
  var y = cur_info['view_y'];
  var w = cur_info['view_w'];
  var h = cur_info['view_h'];

  if(w > 0 && h > 0){
    for(var dy = y; dy < y + h; dy++){
      for(var dx = x; dx < x + w; dx++){
        set_bw(dx,dy,get_d(dx,dy));
      }
    }
  }else{
    for(var dy = 0; dy < MAX_PIXEL_Y; dy++){
      for(var dx = 0; dx < MAX_PIXEL_X; dx++){
        set_bw(dx,dy,get_d(dx,dy));
      }
    }
  }
}