$(document).ready(function() {
    console.log("Loaded DET Warning config")
    var $modal = $('#external-modules-configure-modal');
    $modal.on('show.bs.modal', function() {
        // Making sure we are overriding this module's modal only.
        if ($(this).data('module') !== detWarning.prefix)
            return;
    
        if (typeof ExternalModules.Settings.prototype.resetConfigInstancesOld === 'undefined')
            ExternalModules.Settings.prototype.resetConfigInstancesOld = ExternalModules.Settings.prototype.resetConfigInstances;

        ExternalModules.Settings.prototype.resetConfigInstances = function() {
            ExternalModules.Settings.prototype.resetConfigInstancesOld();
            
            if ($modal.data('module') !== detWarning.prefix)
                return;
            
            $modal.find('thead').remove();
            $modal.find('tr[field=json]').hide();
            $modal.find('tr[field=info] a').on('click', function() {
                $modal.find('tr[field=json]').toggle();
            });
        };
    });
    
    $modal.on('hide.bs.modal', function() {
        // Making sure we are overriding this module's modal only.
        if ($(this).data('module') !== detWarning.prefix)
            return;

        if (typeof ExternalModules.Settings.prototype.resetConfigInstancesOld !== 'undefined')
            ExternalModules.Settings.prototype.resetConfigInstances = ExternalModules.Settings.prototype.resetConfigInstancesOld;
    });
});