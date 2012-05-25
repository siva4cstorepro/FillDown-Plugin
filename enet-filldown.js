//==========================================================
// DESCRIPTION: Plugin for filldown UI in the grids
// NOTES: Sample syntax required
//         <input type="hidden" class="EWF-UI-FillDown" data-EWF-FillDown-MatchingName="filldownfieldName">
//          $('.EWF-UI-FillDown').fillDown();
//==========================================================

//TODO: 
//1. Ability to have a dropdown and filldown to a textbox so make it upto the user what they want on the top
//2. Send in class styling
//3. Ability to do some amount of validation
//4. refresh -> developer should be able to reload the control
//5. not error out on empty grid
//6. filldown by class, filldown by name
//7. Find out a way to revert back the last action


//PROBLEMS: 
// 2. The filldown children IDs are not dependable as there is txtDeptID_

(function ($) {
    $.fn.extend({
        fillDown: function (options) {

            //Settings list and the default values
            var defaults = {
                override: true
            };
            var options = $.extend(defaults, options);

            return this.each(function () {

                var o = options;

                //Assign current element to variable
                var objFilldown = $(this);
                var validator = validateFillDown(objFilldown);
                if (validator.isValid) {

                    if ($("[id*='" + validator.MappedField + "']").length > 0) {
                        //generate HTML
                        autogenerateControl(validator.MappedField, objFilldown)

                        //bind click event on the button next to the element
                        $('#EWF-txtFillParent-' + validator.MappedField + '_Apply').on("click", function (event) {
                            event.preventDefault;

                            //Validate if the value is selected
                            var fillDownValue = $('#EWF-txtFillParent-' + validator.MappedField + '_ID').val();
                            if (fillDownValue != undefined || fillDownValue != '') {

                                $("[id*='" + validator.MappedField + "']").each(function (i) {
                                    //if the overide to true no need to check whether it has values
                                    if (o.override) {
                                        $(this).val(fillDownValue);
                                    }
                                    else {
                                        if ($(this).val() == "" || $(this).val() == "-1") {
                                            $(this).val(fillDownValue);
                                        }
                                    }
                                });
                            }
                            else {
                                alert('Please enter a select a valid value');
                            }

                        });
                    }

                }

            }); //this.each(function () {
        }
    }); //fillDown: function (options) { 

    function autogenerateControl(mappedField, objFilldown) {
        //find the element type
        var generatedComponent = '';
        var tagName = $("[id*='" + mappedField + "']").get(0).tagName.toLowerCase();

        if (tagName == undefined || tagName == '') {
            EUIShowInfoBar('Unable to to find the tag name of the fill down children');
        }
        else if (tagName == "select") {
            generatedComponent = generateDropDown(mappedField, objFilldown);
        }
        else if (tagName == "input") {
            //find the type
            var fieldType = $("[id*='" + mappedField + "']").attr('type');

            //could be textbox/checkbox
            if (fieldType == 'text') {
                generatedComponent = generateInput(mappedField, objFilldown);
            }
        }
        objFilldown.parent().attr("nowrap", "nowrap"); //Fix to make sure the filldown shows next to the input element
        objFilldown.parent().html(generatedComponent);
    }


    function generateDropDown(mappedField, objFilldown) {
        var component = '';
        //decide whether to depend of the current object or the children of the filldown
        component = '<div id="EWF-FillDown-Container">'
        //component = component + '<select name="' + objFilldown.attr('name') + '" class="span5" id="' + objFilldown.attr('id') + '" form="' + objFilldown.closest("form").attr('id') + '">';
        component = component + '<select name="EWF-txtFillParent-' + mappedField + '" class="' + $("[id*='" + mappedField + "']").attr("class") + '" id="EWF-txtFillParent-' + mappedField + '_ID" form="' + objFilldown.closest("form").attr('id') + '">';
        component = component + $("[id*='" + mappedField + "']").html();
        component = component + '</select>';
        component = component + '   <a href="#"><img alt="Copy in all fields below" class="EWF-JQE-UpdateAmt" id="EWF-txtFillParent-' + mappedField + '_Apply" height="16px" width="16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnVJREFUeNpck01rFEEQhqv6Yze72SSaYIwKMRADMeYqCHrR4MW7OefkTYgQvAj6G0T9AQp6FRXPHvWuXqKCKAkYEuNudueju7rLmtlM3LWhZ3p66n2q+p0aXH+3A8MDz2t2j5BDSx7ocNMw6nbA2m0A3hyMNgdJOixHnMuSdIW8L9blHjODsRZGmo1ZWQ8Dkiz/vwKK5EUkyRm5v8foCSKlyst6KNo4yTSQvZyRCDhSuQOlggEVgEINUarBAYgxGPpimY5YAgCidxWgqkAAEbTwG5ohoPkHGG/qo+xp5mC/6zmQE8pwBaAiKynuRIPhwI4Ius826tAoGXONmr5ItXz5VycBpVQ/9eGI0avJprkWdX0cGd+Laq8EbO12KgNaIU8fk3PTFIqz4KBXLK7Czn7nwV7S+FBrwgpXFbR7aQX4FJy7E/P0uRooa6AK9M7/MWhv5ZoSqAA5qzKicMLW6y8iuevksjUYYhTGi5Ha3NcKPwZxOlSA5WYORmJ/k4af3gpJ3/NElyTx4lH2Qmxqr5QxT3Y6XTg32oVJy0ACMjenuoWT0I0Knm1Z+ObCdob2bp16r7k4WP8b7DplN6aQ4+pMgKUxLAG59IvKxKyeiI2ErZ1KYe0MwdKEfpMFeOgdQeI8JGg2Flv4dXXaweXjEYpe6Er7FFpTNVGUawQFC/ILXRgL8FbO+/JHuDI/ips3ZvXT5WMaipYrhGLykUVGPsckEZ2W+0KMcYIQRzNmfXUK4ozRn8cttM82w3rPy4mZgzRcT3Rt6ZMv8rxtRATOOS2QhrxoSkBLXlhUanS+pb6LSu1ndBIxJLLvyn8lRmet1TLhrwADADZIT56vKModAAAAAElFTkSuQmCC"></a>';
        component = component + '</div>';
        return component;
    }

    function generateInput(mappedField, objFilldown) {
        var component = '';
        component = '<div id="EWF-FillDown-Container">'
        component = component + '   <input type="text" name="EWF-txtFillParent-' + mappedField + '" class="' + $("[id*='" + mappedField + "']").attr("class") + '" id="EWF-txtFillParent-' + mappedField + '_ID" form="' + objFilldown.closest("form").attr('id') + '">';
        component = component + '   <a href="#"><img alt="Copy in all fields below" class="EWF-JQE-UpdateAmt" id="EWF-txtFillParent-' + mappedField + '_Apply" height="16px" width="16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnVJREFUeNpck01rFEEQhqv6Yze72SSaYIwKMRADMeYqCHrR4MW7OefkTYgQvAj6G0T9AQp6FRXPHvWuXqKCKAkYEuNudueju7rLmtlM3LWhZ3p66n2q+p0aXH+3A8MDz2t2j5BDSx7ocNMw6nbA2m0A3hyMNgdJOixHnMuSdIW8L9blHjODsRZGmo1ZWQ8Dkiz/vwKK5EUkyRm5v8foCSKlyst6KNo4yTSQvZyRCDhSuQOlggEVgEINUarBAYgxGPpimY5YAgCidxWgqkAAEbTwG5ohoPkHGG/qo+xp5mC/6zmQE8pwBaAiKynuRIPhwI4Ius826tAoGXONmr5ItXz5VycBpVQ/9eGI0avJprkWdX0cGd+Laq8EbO12KgNaIU8fk3PTFIqz4KBXLK7Czn7nwV7S+FBrwgpXFbR7aQX4FJy7E/P0uRooa6AK9M7/MWhv5ZoSqAA5qzKicMLW6y8iuevksjUYYhTGi5Ha3NcKPwZxOlSA5WYORmJ/k4af3gpJ3/NElyTx4lH2Qmxqr5QxT3Y6XTg32oVJy0ACMjenuoWT0I0Knm1Z+ObCdob2bp16r7k4WP8b7DplN6aQ4+pMgKUxLAG59IvKxKyeiI2ErZ1KYe0MwdKEfpMFeOgdQeI8JGg2Flv4dXXaweXjEYpe6Er7FFpTNVGUawQFC/ILXRgL8FbO+/JHuDI/ips3ZvXT5WMaipYrhGLykUVGPsckEZ2W+0KMcYIQRzNmfXUK4ozRn8cttM82w3rPy4mZgzRcT3Rt6ZMv8rxtRATOOS2QhrxoSkBLXlhUanS+pb6LSu1ndBIxJLLvyn8lRmet1TLhrwADADZIT56vKModAAAAAElFTkSuQmCC"></a>';
        component = component + '</div>';
        return component;
    }

    function validateFillDown(objFilldown) {
        var isOpSuccessful = false;

        //get all the current fields
        //TODO: Have to validate for the reference ids and names

        var strMappedFieldID = '';
        strMappedFieldID = objFilldown.attr('data-EWF-FillDown-MatchingName');

        if (strMappedFieldID == undefined || strMappedFieldID == '') {
            EUIShowInfoBar('Unable to setup Fill Down because data-EWF-FillDown-MatchingName element ID is not defined properly or does not exist.');
            isOpSuccessful = false;
        }
        else {
            isOpSuccessful = true;
        }

        return {
            isValid: isOpSuccessful
                    , MappedField: strMappedFieldID
        }
    }

})(jQuery);


