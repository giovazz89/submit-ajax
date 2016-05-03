submit-ajax
===========

Ajax management JQuery plugin (init for bootstrap, but customizable)

### Usage

Submit Ajax can be used on any FORM, INPUT or A element that generates respectively a SUBMIT, CHANGE or CLICK event.

Use the 'disabled' HTML attribute in the element to prevent submit-ajax from sending.

```
$('element_to_submit_selector').submitAjax();
```

OR

```
$('element_to_submit_selector').submitAjax('fields_to_send_on_action_selector');
// the fields to send selector gets the choosen fields and sends only them</code>
```


### Notes

File support (multipart/form-data) is not implemented completely yet!

Uses jQuery

Uses bootstrap .tooltip() function in form validation


### Response structure

The JSON response can contain as much of the following elements as needed

|json response|HTML attribute|description|
|-------------|--------------------------|-----------|
|"form-errors": {"name": "error", ...}|-|manage errors in form submission|
|"append": {"append": "HTML to append", "to": "jQuery selector"}|-|appends HTML to a specified element|
|"append": "HTML to append"|append-to="jQuery selector"|appends HTML to a specified element|
|"prepend": {"prepend": "HTML to prepend", "to": "jQuery selector"}|-|prepends HTML to a specified element|
|"prepend": "HTML to prepend"|prepend-to="jQuery selector"|prepends HTML to a specified element|
|"after": {"after": "HTML to insert", "of": "jQuery selector"}|-|inserts HTML after a specified element|
|"after": "HTML to insert"|after-of="jQuery selector"|inserts HTML after a specified element|
|"before": {"before": "HTML to insert", "of": "jQuery selector"}|-|inserts HTML before a specified element|
|"before": "HTML to insert"|before-of="jQuery selector"|inserts HTML before a specified element|
|"remove": "jQuery selector"|-|removes a specified element|
|"empty": "jQuery selector"|-|empties a specified element|
|"goto": "URL or 'this'"|-|loads the specified URL or reloads page|
|"fill": {"fill": "HTML to insert", "filled": "jQuery selector"}|-|replaces the HTML in a specified element|
|"fill": "HTML to insert"|filled="jQuery selector"|replaces the HTML in a specified element|
|"replace": {"replace": "HTML to insert", "to": "jQuery selector"}|-|replaces the specified element with given HTML|
|"replace": "HTML to insert"|replace-to="jQuery selector"|replaces the specified element with given HTML|
|"run": "code"|-|Run the javascript code specified in the string|
|"reset-form": ""|-|Resets all fields in the sending FORM|


### Defaults

```
$.fn.submitAjax.options = {
        'errorClass': 'has-error',  // class applied to form elements with errors
        'successClass': 'has-success',  // success class applied to form elements
        'classesToClean': ['has-warning', 'has-info'],  // additional classes to remove at every form submission
        'applyStatusAt': '.form-group'  // ancestor selector to which you are assigned the classes
    }
```
