$(document).ready(function () {
    $('head').append(`
    <style>
        #detWarningPre { padding-left: 40px; position: relative; font-size: 1.125em; }
        #detWarningPre .line { position: absolute; left: 10px; width: 30px; display: inline-block; }
        #openDETmodal { cursor: pointer; }
    </style>
    `)
    
    $('body').after(`
    <div id="detWarnDialog" title="DET Warning">
        <pre id="detWarningPre" class="line-numbers language-php mb-0"> 
<code id="detWarningCode" class="language-php"></code>
        </pre>
    </div>`);
    $("#detWarningCode").html( hljs.highlight('php', detWarning.config.content).value );
    addSourceLineNumbers();
    var _openAddQuesForm = openAddQuesForm;
    openAddQuesForm = function(fieldName,a,b,c) {
        _openAddQuesForm(fieldName,a,b,c);
        if ( detWarning.config.usedElements.includes(fieldName) )
            decorateDETwarning();
    }
});

function decorateDETwarning() {
    if ( !$("#detWarnTop").length ) {
        $("#add_field_settings").prepend(`<span id="detWarnTop" class="mb-1"><b>DET Warning:</b> 
        This field is used on a Data Entry Trigger, review the code used <a id="openDETmodal">here</a> before making changes.</span><br><br>`);
        $('#openDETmodal').on('click', function() {
            $('#detWarnDialog').dialog({ bgiframe: true, modal: true, width: 900,
                buttons: [
                    { text: 'Close', click: function () { $(this).dialog('close'); } },
                ]
            });
        });
    }
    if ( !$("#detWarnBottom").length )
        $(".ui-dialog-buttonset").append('<i id="detWarnBottom" title="DET Warning" class="fas fa-exclamation-triangle mr-3 mt-2 fa-2x"></i>');
    if ( !$("#detWarnTop").length || !$("#detWarnBottom").length )
        setTimeout( decorateDETwarning, 100 );
}

function addSourceLineNumbers() {
    let prefix = 'prefix';
    let l = 0;
    let result = $("#detWarningPre").html().trim().replace(/\n/g, function() {
                l++;
                return "\n" + '<a class="line" name="' + prefix + l + '">' + l + '</a>';
            });
    $("#detWarningPre").html('<a class="line" name="' + prefix + '0">0</a>' + result);
}