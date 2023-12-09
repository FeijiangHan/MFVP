document.onload=()=>{
    // console.log("加载了js")
    var isMouseDown,initX,initY;
    var draggable=document.getElementById("draggable");
    draggable.addEventListener('mousedown',function(e){
        isMouseDown=true;
        document.body.classList.add('no-select');
        initX=e.offsetX;
        initY=e.offsetY;
    })
    draggable.addEventListener("mouseup",function(){
        isMouseDown=false;
        document.body.classList.remove('no-select');
    })

    var height=draggable.offsetHeight;
    var width=draggable.offsetWidth;
    document.addEventListener('mousemove',function(e){
        if(isMouseDown){
            var cx=e.clientX-initX;
            var cy=e.clientY-initY;
            if(cx<0){
                cx=0;
            }
            if(cy<0){
                cy=0;
            }
            if(window.innerWidth-e.clientX+initX<width){
                cx=window.innerWidth-width;
            }
            if(e.clientY>window.innerHeight-height+initY){
                cy=window.innerHeight-height;
            }
            draggable.style.left=cx+"px";
            draggable.style.top=cy+"px";
        }
    })
    document.addEventListener('mouseup',function(e){
        if(e.clientY>window.innerWidth||e.clientY<0||e.clientX<0||e.clientX>window.innerHeight){
            isMouseDown=false;
            document.body.classList.remove('no-select');
        }
    })
}