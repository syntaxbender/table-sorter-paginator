
var sbTableSorter = {
	arrays: {},
	headers:{},
	rowCounts:{},
	sortHolder:{},
	activePages: {},
	renderTable: function(header,elementID,array,start){
		var bufferHeader = "<tr>";
		var bufferTable = "";
		for(var i=0;i<(header.length);i++){
			bufferHeader += "<th><div style=\"cursor:pointer;display:inline-block;vertical-align:top;\" class=\"sbTableSortButton\" data-element=\""+elementID+"\" data-column=\""+i+"\">"+header[i]+"</div><span style=\"font-size:8px;margin-top:-4px;\" class=\"fa-stack fa-lg\"><i class=\"fa fa-chevron-up fa-stack-1x\"></i><i style=\"padding-top: 8px;\" class=\"fa fa-chevron-down fa-stack-1x\"></i></span></th>";
		}
		bufferHeader += "</tr>";
		console.log("count :x "+this.rowCounts[elementID]);
		console.log((start+this.rowCounts[elementID]));
		for(var i=start;i<(start+this.rowCounts[elementID]);i++){
			if(array[i] == null) break;
			bufferTable += "<tr>";
			for(var i2=0;i2<(header.length);i2++){
				console.log(array[i][i2]);
				bufferTable += "<td>"+array[i][i2]+"</td>";
			}
			bufferTable += "</tr>";
		}
		//console.log(elementID);
		var totalPageNum = Math.ceil(array.length/this.rowCounts[elementID]);
		var bufferPaginationButtons = "";
		for(var i=1;i<=totalPageNum;i++){
			//console.log("active : "+this.activePages[elementID]);
			//console.log("inci: "+i);
			if(i == this.activePages[elementID]){
				bufferPaginationButtons += "<div style=\"display:inline-block; margin:0px 5px; background:blue;padding:5px;border-radius:8px;\" class=\"sbTablePageButton\" data-element=\""+elementID+"\" data-pagenum=\""+i+"\">"+i+"</div>";
			}else{
				bufferPaginationButtons += "<div style=\"display:inline-block; margin:0px 5px; background:red;padding:5px;border-radius:8px;\" class=\"sbTablePageButton\" data-element=\""+elementID+"\" data-pagenum=\""+i+"\">"+i+"</div>";
			}
		}
		$("#"+elementID+"-pagination").html(bufferPaginationButtons);
		$("#"+elementID).html(bufferHeader+bufferTable);
	},
	sort: function(elementID,column){
		if(this.sortHolder[elementID] == column){
			console.log(1);
			delete this.sortHolder[elementID];
			sortedArr = this.arrays[elementID].reverse();
		}else{
			sortedArr = this.arrays[elementID].sort(function (a, b){
			  return a[column].localeCompare(b[column]);
			});
			console.log(sortedArr);
			this.arrays[elementID] = sortedArr;
			this.sortHolder[elementID] = column;
		}
		this.activePages[elementID] = 1;
		this.renderTable(this.headers[elementID],elementID,sortedArr,0);
	},
	changePage: function(elementID,pagenum){
		this.activePages[elementID] = pagenum;
		var startID=(pagenum-1)*this.rowCounts[elementID];
		this.renderTable(this.headers[elementID],elementID,this.arrays[elementID],startID);
	},
	search: function(elementID,search){

	},
	run: function(options){
		//for ile arraydaki eleman array lengthi al verilen length(kolon sayisi) ile check et eşlemeşmeyen varsa array hata bas. 
		//header length ile  arraydaki eleman array lengthi kontrol et aynı değilse hata bas
		this.arrays[options.elementID] = options.array;
		this.headers[options.elementID] = options.headers;
		this.rowCounts[options.elementID] = options.rowCount;
		this.activePages[options.elementID] = 1;
		this.renderTable(options.headers,options.elementID,options.array,0);
 
		$(document).on('click', ".sbTableSortButton", function(event){
			var elementID = $(this).data("element");
			var column = $(this).data("column");
			sbTableSorter.sort(elementID,column);
		});
		$(document).on('click', ".sbTablePageButton", function(event){
			var elementID = $(this).data("element");
			var pagenum = $(this).data("pagenum");
			sbTableSorter.changePage(elementID,pagenum);
		});
	}
} 
