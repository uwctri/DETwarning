detWarning.css = `
<style>
    #detWarningPre { padding-left: 40px; position: relative; font-size: 1.125em; }
    #detWarningPre .line { position: absolute; left: 10px; width: 30px; display: inline-block; }
    #openDETmodal { cursor: pointer; }
    #detWarnDialog { display: none; }
</style>`;

detWarning.html = {};
detWarning.functions = {};
detWarning.html.bottom = `<i id="detWarnBottom" title="DET Warning" class="fas fa-exclamation-triangle mr-3 mt-2 fa-2x"></i>`;
detWarning.html.top = `
<span id="detWarnTop" class="mb-1">
    <b>DET Warning:</b> This field is used on a Data Entry Trigger, review the code used <a id="openDETmodal"><u>here</u></a> before making changes.<br><br>
</span>`;
detWarning.html.topNoLink = `
<span id="detWarnTop" class="mb-1">
    <b>DET Warning:</b> This field is used on a Data Entry Trigger! Changes may have unintended complications.<br><br>
</span>`;
detWarning.html.modal = `
<div id="detWarnDialog" title="DET Warning">
    <pre id="detWarningPre" class="line-numbers mb-0"> 
        <code id="detWarningCode" class="language-php"></code>
    </pre>
</div>`;

$(document).ready(function () {
    $('head').append(detWarning.css);
    $('body').after(detWarning.html.modal);
    
    $("#detWarningCode").html( hljs.highlight('php', detWarning.config.content).value );
    detWarning.functions.addLineNumbers();
    let _openAddQuesForm = openAddQuesForm;
    
    openAddQuesForm = function(sq_id,question_type,section_header,signature) {
        $("#detWarnTop").remove();
        _openAddQuesForm(sq_id,question_type,section_header,signature);
        if ( detWarning.config.usedElements.includes(sq_id) && !(question_type == "" && section_header == 0) ) {
            detWarning.functions.decorateDETwarning();
        }
    }
});

detWarning.functions.decorateDETwarning = function() {
    
    if ( !$("#detWarnTop").length && detWarning.config.content ) {
        $("#add_field_settings").prepend(detWarning.html.top);
        $('#openDETmodal').on('click', function() {
            $('#detWarnDialog').dialog({
                bgiframe: true, modal: true, width: 900, height: 800,
                buttons: [{ 
                    text: 'Close', 
                    click: function () { $(this).dialog('close'); } 
                }]
            });
        });
    } else if ( !$("#detWarnTop").length ) {
        $("#add_field_settings").prepend(detWarning.html.topNoLink);
    }
    
    if ( !$("#detWarnBottom").length ) {
        $(".ui-dialog-buttonset").append(detWarning.html.bottom);
    }
    
    // Some slower computers might have an issue with the JS load. Run this again if so.
    if ( !$("#detWarnTop").length || !$("#detWarnBottom").length ) {
        setTimeout( decorateDETwarning, 100 );
    }
}

detWarning.functions.addLineNumbers = function() {
    let l = 1;
    $("#detWarningPre").html('<span class="line" name="ln0">0</span>'+
        $("#detWarningPre").html().trim().replace(/\n/g, function() {
            return `\n<span class="line" name="ln${l}">${l++}</span>`;
        })
    );
}