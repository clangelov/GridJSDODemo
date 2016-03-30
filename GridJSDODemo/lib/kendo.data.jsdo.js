(function(){
function initializeJSDO(transport, config) {
	if (config.jsdo) return;
	var session = new progress.data.Session();
	var userName = config.userName ? config.userName : "";
	var password = config.password ? config.password : "";
	if (config.authenticationModel) {
		session.authenticationModel	= config.authenticationModel;
	}	
	session.login(config.serviceURI, userName, password);
	session.addCatalog(config.catalogURI);
	var jsdo = new progress.data.JSDO({ name: config.resourceName });
	jsdo._callbacks = {};
	jsdo.onAfterFill = function onAfterFillJSDO(jsdo, success, request) {
		if (success) {
			if (config.tableName == undefined 
				&& jsdo._defaultTableRef) {
				config.tableName = jsdo._defaultTableRef._name;
			}
			jsdo._callbacks.success(jsdo[config.tableName].getData());
		}
		else {
			jsdo._callbacks.error([]);
		}
	};
	jsdo.onAfterSaveChanges = function onAfterSaveChanges(jsdo, success, request) {
		var data;
		var record;
		if (success) {
			if (jsdo._callbacks._id) {
				record = jsdo.findById(jsdo._callbacks._id);
				if (record)
					data = record.data;
			}
			jsdo._callbacks.success(data);
		}
		else {
			jsdo._callbacks.error();			
		}
	};	
	jsdo.subscribe('AfterFill', jsdo.onAfterFill, jsdo);
	jsdo.subscribe('AfterSaveChanges', jsdo.onAfterSaveChanges, jsdo);
	transport.jsdo = jsdo;
}

jQuery.extend(true, kendo.data, {
	schemas: {
		jsdo: {
			type: "json",
			model: {
				id: "_id"
			},			
			data1: function(data) {
				alert("DEBUG: data:");
				return [];
			}
		}
	},
	transports: {
		jsdo: {
			read: function(options) {
				if (!this.jsdo) initializeJSDO(this, this.config);
				var jsdo = this.jsdo;
				jsdo._callbacks.success = options.success;
				jsdo._callbacks.error = options.error;					
				jsdo.fill(this.config.filter);
			},
			create: function(options) {
				if (!this.jsdo) initializeJSDO(this, this.config);
				var jsdo = this.jsdo;
				jsdo._callbacks.success = options.success;
				jsdo._callbacks.error = options.error;				
				var jsrecord = jsdo.add(options.data);
				jsdo._callbacks._id = jsrecord.data._id;
				jsdo.saveChanges();
			},
			update: function(options) {
				if (!this.jsdo) initializeJSDO(this, this.config);
				var jsdo = this.jsdo;
				jsdo._callbacks._id = options.data._id;
				jsdo._callbacks.success = options.success;
				jsdo._callbacks.error = options.error;
				jsdo.findById(options.data._id);				
				jsdo.assign(options.data);
				jsdo.saveChanges();
			},
			destroy: function(options) {
				if (!this.jsdo) initializeJSDO(this, this.config);
				var jsdo = this.jsdo;
				jsdo._callbacks._id = options.data._id;
				jsdo._callbacks.success = options.success;
				jsdo._callbacks.error = options.error;
				jsdo.findById(options.data._id);				
				jsdo.remove();
				jsdo.saveChanges();
			}						
		}
	}	
});
})();