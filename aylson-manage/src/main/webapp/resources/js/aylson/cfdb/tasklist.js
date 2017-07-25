	/**
	 * 任务配置
	 */
	var datagrid;
	var editor;
	
	$(function() { 
		datagrid = $('#datagrid').datagrid({
			method:'get',
			url : projectName+'/cfdb/tasklist/admin/list?v_date=' + new Date(),
			pagination : true,
			pageSize : 20,
			pageList : [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ],
			fit : true,
			fitColumns : false,
			nowrap : false,
			border : false,
			idField : 'taskId',
			singleSelect:true,
			rownumbers: true,
			toolbar:[{
				text:"新增",
				iconCls : 'icon-add',
				handler : add
			},{
				text:"刷新",
				iconCls : 'icon-reload',
				handler : reload
			}],
 			frozenColumns : [[{ 
				field : 'opt',
				title : '操作选项',
				align : 'center',
				width : 100,
				formatter:function(value,row,index){
					var handleHtml = '';
					handleHtml += '<a href="javascript:edit(\'' + row.taskId + '\')">修改</a>&nbsp;';
					handleHtml += '<a href="javascript:del(\'' + row.taskId + '\')">删除</a>&nbsp;';
					handleHtml += '<a href="javascript:del(\'' + row.taskId + '\')">详情</a>&nbsp;';
					return handleHtml;
				}
			}, {
				title : '任务名称',
				field : 'taskName',
				align : 'center',
				width : 120,
				sortable:true
			}, 
			{
				title : '任务Logo',
				field : 'logoUrl',
				align : 'center',
				width : 80,
				sortable:true,
				formatter:function(value,row,index){
					if(value){
						var handleHtml = '';
						handleHtml += '<img src=\'' + value + '\' style="width:50px;height:50px"/>';
						return handleHtml;
					}
				}
			}, 
			{
				title : '任务标签',
				field : 'taskTag',
				align : 'center',
				width : 150,
				sortable:true
			}, {
				title : '任务剩余数量',
				field : 'amount',
				align : 'center',
				width : 80,
				sortable:true
			}, {
				title : '任务收益金额',
				field : 'income',
				align : 'center',
				width : 80,
				sortable:true
			}, {
				title : '排序编号',
				field : 'orderNo',
				align : 'center',
				width : 80,
				sortable:true
			}, {
				title : '跳转url地址',
				field : 'goUrl',
				align : 'center',
				width : 150,
				sortable:true
			}, {
				title : '创建时间',
				field : 'createDate',
				align : 'center',
				width : 150,
				sortable:true,
				formatter:function(value,row,index){
					if(value){
						return value.substring(0,19);
					}
					return value;
				}
			}
//			, {
//				title : '更新时间',
//				field : 'updateDate',
//				align : 'center',
//				width : 150,
//				formatter:function(value,row,index){
//					if(value){
//						return value.substring(0,19);
//					}
//					return value;
//				}
//			}
			] ]
		});
		
	});
	
	//新增
	function add(obj){
		var win;
		win = $("<div></div>").dialog({
			title:'新增',
			width:450,
			height:'75%',
			modal:true,
			href:projectName+'/cfdb/tasklist/admin/toAdd',
			onClose:function(){
				$(this).dialog("destroy");
			},
			buttons:[{
				text:'确定',
			    iconCls:'icon-ok',
			    handler:function(){
				    	$("#tasklistConfigForm").form('submit',{
				    		 type:'POST',
				    		 url : projectName+'/cfdb/tasklist/admin/add',
				    		 success:function(responseData){
				    			 if(responseData){
				    				var data = $.parseJSON(responseData);
				    			 	$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
				    			 	if(data.success){
										$("#datagrid").datagrid("reload");
										win.dialog('destroy');
				    				}
				    			 } 
				    		 }
				    	 });
			    }   
			   },{
				 text:'取消',
			     iconCls:'icon-cancel',  
			 	 handler:function(){
			 		 win.dialog('destroy');
			 	 }   
			  }]
		});
	}
	
	//修改
	function edit(id){
		win = $("<div></div>").dialog({
			title:'修改',
			width:450,
			height:'75%',
			maximizable:true,
			modal:true,
			href:projectName+'/cfdb/tasklist/admin/toEdit?taskId='+id,
			onClose:function(){
		    		$(this).dialog("destroy");
		    },
			buttons:[{
					text:'确定',
				    iconCls:'icon-ok',
				    handler:function(){
					    	$("#tasklistConfigForm").form('submit',{
					    		 type:'POST',
					    		 url : projectName+'/cfdb/tasklist/admin/update',
					    		 success:function(responseData){
					    			 win.dialog('destroy');
					    			 if(responseData){
					    				var data = $.parseJSON(responseData);
					    			 	$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
					    			 	if(data.success){
					    			 		$("#datagrid").datagrid("reload");
					    				}
					    			 } 
					    		 }
					    	 });
				     }   
				   },{
					 text:'取消',
				     iconCls:'icon-cancel',  
				 	 handler:function(){
				 		 win.dialog('destroy');
				 	 }   
				  }]
		});
	}

	//删除
	function del(id){
		$.messager.confirm("提示","确定删除此记录吗？",function(r){
			if(r){
				$.ajax({
					type:"POST",
					url:projectName+'/cfdb/tasklist/admin/deleteById?taskId=' + id,
					dataType:"json",
					success:function(data){
						if(data){
		    				$.messager.show({"title":"系统提示","msg":data.message,"timeout":1000});
		    				if(data.success){
		    					$("#datagrid").datagrid("reload");
		    				}
		    			 }
					}
				});
			}
		});
	}
	
	//刷新
	function reload(){
		$("#datagrid").datagrid("reload");
	}
	
	//搜索
	function doSearch(){
		$("#datagrid").datagrid("load", serializeObject($("#tasklistForm")));
	}
	
	//重置
	function reset(){
		$("#tasklistForm").form("reset");
	}
	