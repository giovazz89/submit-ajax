// Manage submitting ajax requests
// applicable to forms and links (<form> and <a>)
// no files
// send specified fields passing parameter fiedsToSend

(function ($) {
    $.fn.submitAjax.options = {
        'errorClass': 'has-error',
        'successClass': 'has-success',
        'classesToClean': ['has-warning', 'has-info'],
        'applyStatusAt': '.form-group'
    }

    $.fn.submitAjax = function (fieldsToSend) {
        $(this).each(function () {
            var fields = $(fieldsToSend);
            if (this.tagName == 'FORM')
                $(this).submit(function () {
                    return sendAjax($(this));
                });
            if (this.tagName == 'A')
                $(this).click(function () {
                    return sendAjax($(this));
                });
            if (this.tagName == 'INPUT')
                $(this).change(function () {
                    return sendAjax($(this));
                });

            function sendAjax(element) {
                var opt = $.fn.hilight.defaults;
                element.find(opt['applyStatusAt']).removeClass(opt['errorClass'] + ' ' + opt['successClass'] + ' ' + opt['classesToClean'].join(' '));
                element.find(opt['applyStatusAt'] + ' *[name]').tooltip('destroy');

                var ajaxUrl = '';
                if (element.attr('action') != undefined)
                    ajaxUrl = element.attr('action');
                if (element.attr('href') != undefined)
                    ajaxUrl = element.attr('href');

                var ajaxMethod = 'get';
                //if (element.attr('method') != undefined) 
                //    ajaxMethod = element.attr('method');
                if(element.closest('*[method]').size() > 0)
                	ajaxMethod = element.closest('*[method]').attr('method');

                var ajaxData = {}
                if (element.prop('tagName') == 'FORM') 
                    ajaxData = element.serialize();
                if (element.prop('tagName') == 'INPUT') 
                    ajaxData = element.attr('name') + '=' + element.val();

                if (fields.size() > 0) {
                    //if (validateFields(fields)) {
                        ajaxData = '';
                        fields.each(function () {
                            ajaxData += '&' + $(this).attr('name') + '=' + $(this).val();
                        });
                        ajaxData = ajaxData.substr(1);
                    //}
                    //else return false;
                }

                // ADD CODE - loading feedback

                $.ajax({
                    url: ajaxUrl,
                    type: ajaxMethod,
                    data: ajaxData,
                    success: function (result) {
                        $.fn.submitAjax.manageResponse(result, element);

                        // ADD CODE - remove loading feedback
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var response = $('<div>' + jqXHR.responseText + '<div>');
                        response.find('style').remove();
                        console.error({'SubmitAjax Error': textStatus + ': ' + errorThrown + '<br/><br/>' + response.html()});

                        // ADD CODE - remove loading feedback
                    }
                });

                return false;
            }
        });
    };


    $.fn.submitAjax.manageResponse = function(result, element) {
        var opt = $.fn.hilight.defaults;
        if(result == '') return;
        if(element == undefined) 
            element = $('<a></a>');
        try {
            result = eval('(' + result + ')');
        } catch (error) {
            console.error({'SubmitAjax Error', result});
        }

        $.each(result, function(actionName, action){
            
            //{form-errors: {field-name: 'error text'}}
            if (actionName == 'form-errors') {
                $.each(action, function(fieldName, error){
                    fieldElement = $('*[name="' + fieldName + '"]');
                    fieldElement.attr('title', error);
                    fieldElement.tooltip();
                    fieldElement.closest(opt['applyStatusAt']).addClass(opt['errorClass']);
                });
            }
            // {append: ''} || {append: {append: '', to: 'selector'}}
            if (actionName == 'append') {
                var appendTo = element;
                if (element.attr('append-to') != undefined) 
                    appendTo = $(element.attr('append-to'));
                if (action.to != null) {
                    appendTo = $(action.to);
                    appendTo.append(action.append);
                } else 
                    appendTo.append(action);
            }
            // {prepend: ''} || {prepend: {prepend: '', to: 'selector'}}
            if (actionName == 'prepend') {
                var prependTo = element;
                if (element.attr('prepend-to') != undefined) 
                    prependTo = $(element.attr('prepend-to'));
                if (action.to != null) {
                    prependTo = $(action.to);
                    prependTo.prepend(action.prepend);
                } else 
                    prependTo.prepend(action);
            }
            // {after: ''} || {after: {after: '', of: 'selector'}}
            if (actionName == 'after') {
                var afterTo = element;
                if (element.attr('after-of') != undefined) 
                    afterTo = $(element.attr('after-of'));
                if (action.of != null) {
                    afterTo = $(action.of);
                    afterTo.after(action.after);
                } else 
                    afterTo.after(action);
            }
            // {before: ''} || {before: {before: '', of: 'selector'}}
            if (actionName == 'before') {
                var beforeTo = element;
                if (element.attr('before-of') != undefined) 
                    beforeTo = $(element.attr('before-of'));
                if (action.of != null) {
                    beforeTo = $(action.of);
                    beforeTo.before(action.before);
                } else 
                    beforeTo.before(action);
            }
            // {remove: 'selector'}
            if (actionName == 'remove') 
                $(action).remove();
            // {empty: 'selector'}
            if (actionName == 'empty') 
                $(action).empty();
            // {goto: 'url||this'}
            if (actionName == 'goto') {
                if (action == 'this') 
                    window.location.reload();
                else 
                    window.location.href = action;
            }
            // {fill: ''} || {fill: {fill: '', filled: 'selector'}}
            if (actionName == 'fill') {
                var filled = element;
                if (element.attr('filled') != undefined) 
                    filled = $(element.attr('filled'));
                if (action.filled != null) {
                    filled = $(action.filled);
                    filled.html(action.fill);
                } else 
                    filled.html(action);
            }
            // {replace: ''} || {replace: {replace: '', to: 'selector'}}
            if (actionName == 'replace') {
                var toReplace = element;
                if (element.attr('replace-to') != undefined) 
                    toReplace = $(element.attr('replace-to'));
                if (action.to != null) {
                    toReplace = $(action.to);
                    toReplace.after(action.replace);
                } else 
                    toReplace.after(action);
                toReplace.remove();
            }
            // {run: 'code'}
            if (actionName == 'run') {
                var exec = new Function(action);
                exec();
            }
            // {reset-form: ''}
            if (actionName == 'reset-form') {
                resetForm(element);
            }

        });

        return result;
    }


    function resetForm(form) {
        resetFields(form.find('input:not([type=submit], [type=hidden]), select, textarea'));
    }
    function resetFields(fields) {
        var opt = $.fn.hilight.defaults;
        fields.each(function () {
            $(this).val('');
            $(this).tooltip('destroy');
            $(this).closest(opt['applyStatusAt']).removeClass(opt['errorClass'] + ' ' + opt['successClass'] + ' ' + opt['classesToClean'].join(' '));
        });
    }
})(jQuery);
