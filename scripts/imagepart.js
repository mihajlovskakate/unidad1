function ImagePart(iObjectID){
    this.iObjectID = iObjectID;

    //CONSTANTS
    //JF
    this.NONE = 0;
    this.LETTER = 1;
    this.NUMBER = 2;
    
    //SYSTEM SETTINGS
    this.iMaxImageWidth = 9999;
    this.iMaxImageHeight = 9999;
    this.iChoicePadding = 5;
    this.iChoiceImgPadding = 15;
    this.sChoiceIDPrefix = 'drag';
    this.sDropZoneIDPrefix = 'dropzone';
    this.sIdDelimiter = '_';
    
    //USER SETTINGS
    this.sImage = null;
    this.iChoiceSize = null;
    this.sChoiceBorder = 'solid 1px gray';
    this.sChoiceBackground = 'white';
    this.sDropZoneBorder = 'solid 1px white';
    this.iChoiceSize = 19;
    
    //VARIABLES
    this.bDisplayed = false;
    this.iMaxChoicePRow = null;
    this.oImg = null;
    this.oChoices = new Array();
    this.oDropZones = new Array();
    this.innerHTMLTag = new Array();
    
    this.display = function(oElement){
        if(!this.sImage) return;
        
        this.oImg = ip_buildImageObject(this.sImage,this.iMaxImageWidth,this.iMaxImageHeight);

        oElement.appendChild(this.oImg);
        
        /*var oPos = ip_getElementPos(this.oImg);
        var iImageTop = oPos.y;
        var iImageLeft = oPos.x;
        var iImageWidth = oPos.width;
        var iImageHeight = oPos.height;
        var iCurrTop = iImageTop + iImageHeight + this.iChoiceImgPadding;
        var iCurrLeft = iImageLeft;
        var iColIndex = 1;*/

        //alert("this.oChoices.length IMAGEPART.JS= " + this.oChoices.length);

        for(var i = 0;i < this.oChoices.length;i++){
            //Choice
            this.oChoices[i].oDiv.style.textAlign = 'center'; 
            this.oChoices[i].oDiv.style.verticalAlign = 'middle'; 
            this.oChoices[i].oDiv.style.width = this.iChoiceSize + 'px';
            this.oChoices[i].oDiv.style.height = this.iChoiceSize + 'px';
            this.oChoices[i].oDiv.style.position = 'absolute';
            this.oChoices[i].oDiv.className = 'divDragChoiceCls';
            //this.oChoices[i].oDiv.style.top = iCurrTop + 'px';//
            //this.oChoices[i].oDiv.style.left = iCurrLeft + 'px';//
            //this.oChoices[i].iOriginTop = iCurrTop + 'px';//
            //this.oChoices[i].iOriginLeft = iCurrLeft + 'px';//
            this.oChoices[i].oDiv.style.border = this.sChoiceBorder;
            this.oChoices[i].oDiv.style.background = this.sChoiceBackground;
            this.oChoices[i].oDiv.id = this.sChoiceIDPrefix + this.sIdDelimiter + i;
            this.oChoices[i].oDiv.style.zIndex = '2';
            this.oChoices[i].oDiv.style.cursor = 'move';

            var sLabel = '';
            if(this.iLabelType == this.LETTER){
                sLabel = ip_getLetter(i + 1).toUpperCase();
            }else if(this.iLabelType == this.NUMBER){
                sLabel = (i + 1);
            }
            this.oChoices[i].oDiv.innerHTML = sLabel;

            //Dropzone
            this.oDropZones[i].oDiv.id = this.sDropZoneIDPrefix + this.sIdDelimiter + i;
            this.oDropZones[i].oDiv.style.border = this.sDropZoneBorder;
            this.oDropZones[i].oDiv.style.width = this.iChoiceSize + 'px';
            this.oDropZones[i].oDiv.style.height = this.iChoiceSize + 'px';
            this.oDropZones[i].oDiv.style.position = 'absolute';
            //this.oDropZones[i].oDiv.style.top = (iImageTop + this.oDropZones[i].iTop) + 'px';//
            //this.oDropZones[i].oDiv.style.left = (iImageLeft + this.oDropZones[i].iLeft) + 'px';//
            this.oDropZones[i].oDiv.style.zIndex = '1';
            this.oDropZones[i].oDiv.innerHTML = '&nbsp;';
            
            //Appending elements
            oElement.appendChild(this.oChoices[i].oDiv);
            oElement.appendChild(this.oDropZones[i].oDiv);
            
            //Drag and drop stuff
            if (this.sChoiceIDPrefix == 'drag'){
               this.oChoices[i].oDraggable = new Draggable(this.oChoices[i].oDiv.id,{scroll:window, onEnd:new Function('ip_onDragEnd(' + this.iObjectID + ',' + i + ');'),onStart:new Function('ip_onDragStart(' + this.iObjectID + ',' + i + ');')});
               Droppables.add(this.oDropZones[i].oDiv.id, {scrollingParent: window, onDrop: new Function('ip_onDrop(' + this.iObjectID + ',arguments[0],arguments[1],arguments[2]);')});
            }

            //Calculate next choice top and left
            //iColIndex++;
            
            /*if(iColIndex == this.iMaxChoicePRow){
                iColIndex = 1;
                iCurrTop += this.iChoicePadding + this.iChoiceSize;
                iCurrLeft = iImageLeft;
            }else{
                iCurrLeft += this.iChoicePadding + this.iChoiceSize;
            }*/

            this.innerHTMLTag[i] = sLabel;

            if (this.iChoiceSize > 15){
               var dragIndexId = 'drag_' + i;

               var construtTable = "<table width=\"" + this.iChoiceSize + "\" height=\"" + this.iChoiceSize + "\" align=\"left\" valign=\"top\" border=\"0\">";
               construtTable+= "<tr><td align=\"center\" valign=\"middle\" class=\"divDragChoiceCls\">" + sLabel + "</td></tr>";
               construtTable+= "</table>";

               document.getElementById(dragIndexId).innerHTML = construtTable;
           }
        }
        
        for(var i = 0;i < this.oChoices.length;i++){
            if(this.oChoices[i].oCurrDropZone != null){
                this.oChoices[i].oCurrDropZone.take(this.oChoices[i]);
            }
        }

        this.updatePositions();

        this.bDisplayed = true;
    }
    
    this.hide = function(){
        this.bDisplayed = false;
        
        for(var i = 0;i < this.oDropZones.length;i++){
            Droppables.remove(this.oDropZones[i].oDiv);
        }
    }
    
    this.updatePositions = function(){
        var oPos = ip_getElementPos(this.oImg);
        var iImageTop = oPos.y;
        var iImageLeft = oPos.x;
        var iImageWidth = oPos.width;
        var iImageHeight = oPos.height;
        var iCurrTop = iImageTop + iImageHeight + this.iChoiceImgPadding;
        var iCurrLeft = iImageLeft;
        var iColIndex = 1;

        for(var i = 0;i <  this.oDropZones.length;i++){
            //BOB
            this.oDropZones[i].oDiv.style.top = this.oDropZones[i].iTop + 'px';
            this.oDropZones[i].oDiv.style.left = this.oDropZones[i].iLeft + 'px';

            //JF
            //this.oDropZones[i].oDiv.style.top = (iImageTop + this.oDropZones[i].iTop) + 'px';
            //this.oDropZones[i].oDiv.style.left = (iImageLeft + this.oDropZones[i].iLeft) + 'px';
        }
        
        for(var i = 0;i <  this.oChoices.length;i++){
            //BOB
            this.oChoices[i].iOriginTop = (iCurrTop - iImageTop) + 'px';
            this.oChoices[i].iOriginLeft = iCurrLeft + 'px';

            //JF
            //this.oChoices[i].iOriginTop = iCurrTop + 'px';
            //this.oChoices[i].iOriginLeft = iCurrLeft + 'px';

            if(this.oChoices[i].oCurrDropZone != null){
                this.oChoices[i].oDiv.style.top = this.oChoices[i].oCurrDropZone.oDiv.style.top;
                this.oChoices[i].oDiv.style.left = this.oChoices[i].oCurrDropZone.oDiv.style.left;
            }else{
                //BOB
                //this.oChoices[i].oDiv.style.top = iImageHeight + this.iChoiceImgPadding + 'px';
                this.oChoices[i].oDiv.style.top = (iCurrTop - iImageTop) + 'px';
                this.oChoices[i].oDiv.style.left = iCurrLeft + 'px';

                //JF
                //this.oChoices[i].oDiv.style.top = iCurrTop + 'px';
                //this.oChoices[i].oDiv.style.left = iCurrLeft + 'px';
            }
            
            iColIndex++;
            //alert(Math.floor(this.iMaxChoicePRow) + ' / ' + iColIndex);
            if(iColIndex == Math.floor(this.iMaxChoicePRow)){
                iColIndex = 1;
                iCurrTop += this.iChoicePadding + this.iChoiceSize;
                iCurrLeft = iImageLeft;
            }else{
                iCurrLeft += this.iChoicePadding + this.iChoiceSize;
            }
        }
    }
    
    
    
    this.addChoice = function(iTop,iLeft){
       var oChoice = new ip_Choice();
       oChoice.iID = this.oChoices.length;
       this.oChoices[oChoice.iID] = oChoice;

       var oDropZone = new ip_DropZone();
       oDropZone.iID = this.oDropZones.length;
       oDropZone.iTop = iTop;
       oDropZone.iLeft = iLeft;
       this.oDropZones[oDropZone.iID] = oDropZone;
    }
    
    this.setChoiceSize = function(i){
        this.iChoiceSize = i;
        this.iMaxChoicePRow = this.iMaxImageWidth / (this.iChoiceSize + this.iChoicePadding);
    }
    
    this.setLabelType = function(i){
        this.iLabelType = i;
    }
    
    this.onWindowResize = function(){
        if(!this.bDisplayed) return;
        
        this.updatePositions();
    }
    
    this.onDragEnd = function(iChoiceID){
        if(this.oChoices[iChoiceID].oCurrDropZone == null){
            this.oChoices[iChoiceID].oDiv.style.top = this.oChoices[iChoiceID].iOriginTop;
            this.oChoices[iChoiceID].oDiv.style.left = this.oChoices[iChoiceID].iOriginLeft;
        }
    }
    
    this.onDragStart = function(iChoiceID){
        this.oChoices[iChoiceID].oCurrDropZone = null;
    }
    
    this.onDrop = function(oChoice,oDropZone){

        iChoiceIndex = oChoice.id.substring(oChoice.id.lastIndexOf(this.sIdDelimiter) + 1);
        iDropZoneIndex = oDropZone.id.substring(oDropZone.id.lastIndexOf(this.sIdDelimiter) + 1);

        var strUserAnswers = document.getElementById('userAnswers').value;
        var splitUserAnswerDrop;
        var idInDrop;

        if (strUserAnswers != ""){
             splitUserAnswerDrop = strUserAnswers.split("x");
             idInDrop = splitUserAnswerDrop[iDropZoneIndex];
        }
        else{
            idInDrop = "-1";
        }


        if (parseInt(idInDrop) != "-1"){
            this.oDropZones[iDropZoneIndex].lose(this.oChoices[idInDrop]);
        }

        this.oDropZones[iDropZoneIndex].take(this.oChoices[iChoiceIndex]);


        //BOB *************************/
        for(i = 0;i < this.oChoices.length;i++){
            if (document.getElementById('idDrop' + i).value == iChoiceIndex)
               document.getElementById('idDrop' + i).value = "";
        }
        document.getElementById('idDrop' + iDropZoneIndex).value = iChoiceIndex;

        strUserAnswers = "";
        for(i = 0;i < this.oChoices.length;i++){
            if (document.getElementById('idDrop' + i).value != "")
               strUserAnswers = strUserAnswers + document.getElementById('idDrop' + i).value + "x";
            else
               strUserAnswers = strUserAnswers + "-1x"; 
        }
        document.getElementById('userAnswers').value = strUserAnswers;
        //*****************************/
    }
    
    this.onChoiceMade = function(){}
    
    //Construct
    this.setChoiceSize(this.iChoiceSize); //grosseur des zones dans l'image
}

function ip_DropZone(){
    this.oDiv = ip_buildHTMLElement('div',{});
    this.iID = null;
    this.oCurrChoice = null;
    this.iTop = null;
    this.iLeft = null;
    
    this.take = function(oChoice){
        this.oCurrChoice = oChoice;
        oChoice.oCurrDropZone = this;
        oChoice.oDiv.style.top = this.oDiv.style.top;
        oChoice.oDiv.style.left = this.oDiv.style.left;
    }
    
    this.lose = function(insideChoice){
        if(!this.oCurrChoice) return;
        
        insideChoice.oDiv.style.top = this.oCurrChoice.iOriginTop;
        insideChoice.oDiv.style.left = this.oCurrChoice.iOriginLeft;

        this.oCurrChoice.oCurrDropZone = null;
        this.oCurrChoice = null;
    }
}

function ip_Choice(){
    this.oDiv = ip_buildHTMLElement('div',{});
    this.iID = null;
    this.oCurrDropZone = null;
    this.iOriginTop = null;
    this.iOriginLeft = null;
    this.oDraggable = null;

   // alert("this.oDiv.innerHtml = " + this.oDiv);
}

function getNewImagePart(){
    if(!top.oImageParts) {
        top.oImageParts = new Array();
        window.onresize = ip_windowResize;
    }
    
    var iNewID = top.oImageParts.length
    top.oImageParts[iNewID] = new ImagePart(iNewID);
    return top.oImageParts[iNewID];
}

function ip_windowResize(){
    for(var i = 0;i < top.oImageParts.length;i++){
        top.oImageParts[i].onWindowResize();
    }
}

function ip_onDragEnd(iObjectID,iChoiceID){
    top.oImageParts[iObjectID].onDragEnd(iChoiceID);
}

function ip_onDragStart(iObjectID,iChoiceID){
    top.oImageParts[iObjectID].onDragStart(iChoiceID);
}

function ip_onDrop(iObjectID,oChoice,oDropZone,oEvent){
    top.oImageParts[iObjectID].onDrop(oChoice,oDropZone);
}

function ip_buildHTMLElement(sTagName,aAtts){
    var oElement = null;

    try{
        var sElementHTML = '<' + sTagName;
        for(var sAtt in aAtts){
            if(aAtts[sAtt] || typeof aAtts[sAtt] != 'object'){
                sElementHTML += ' ' + sAtt + '=\"' + aAtts[sAtt] + '\"';
            }
        }
        sElementHTML += ">";
        
        oElement = document.createElement(sElementHTML);
    }catch(e){
        oElement = document.createElement(sTagName.toUpperCase());
        
        for(var sAtt in aAtts){
            if(aAtts[sAtt] || typeof aAtts[sAtt] != 'object'){
                oElement.setAttribute(sAtt,aAtts[sAtt]);
            }
        }
    }
    
    return oElement;
}
function ip_getElementPos(oElement)
{
    var oGeo = {x:0, y:0, height:0, width:0};
    
    oGeo.height = oElement.offsetHeight;
    oGeo.width = oElement.offsetWidth;
    if(oGeo.height == 0 && oGeo.width == 0 && typeof oElement.width != 'undefined')
    {
        oGeo.height = oElement.height;
        oGeo.width = oElement.width;
    }
    
    if (oElement.offsetParent)
    {
        while (oElement)
        {
            //BOB
            oGeo.x += 0;

            //JF
            //oElement.offsetLeft;

            oGeo.y += oElement.offsetTop;
            oElement = oElement.offsetParent;
        }
    }
    else if (oElement.x)
    {
        oGeo.x += oElement.x;
        oGeo.y += oElement.y;
    }
    
    return oGeo;
}
function ip_buildImageObject(sFilePath,iMaxWidth,iMaxHeight){
    var iNewWidth = 100;
    var iNewHeight = 150;
    var sInnerHTML = "";

    var oImg = new Image();
    oImg.src = sFilePath;

    if(oImg.width > iMaxWidth){
        iNewWidth = iMaxWidth;
        iNewHeight = ip_b2(oImg.width,oImg.height,iMaxWidth);
    }else{
        iNewWidth = oImg.width;
        iNewHeight = oImg.height;
    }
    
    if(iNewHeight > iMaxHeight){
        iNewWidth = ip_b2(iNewHeight,iNewWidth,iMaxHeight);
        iNewHeight = iMaxHeight;
    }
    
    iNewWidth = Math.round(iNewWidth);
    iNewHeight = Math.round(iNewHeight);
    
    return ip_buildHTMLElement('img',{src:sFilePath, width:iNewWidth, height:iNewHeight});
}
function ip_b2(a1,a2,b1){
    return (a2 * b1) / a1;
}

var ip_sLetters = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");

function ip_getLetter(i){
    var sLetter = "";
    
    if(i < 27){
        sLetter = ip_sLetters[i - 1];
    }else if((i % 26) == 0) {
        sLetter = ip_sLetters[Math.floor(i  / 26) - 2] + ip_getLetter(26);
    }else{
        sLetter = ip_sLetters[Math.floor(i  / 26) - 1] + ip_getLetter(i % 26);
    }
    
    return sLetter;
}