<?php

namespace UWMadison\detWarning;
use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

use REDCap;

function printToScreen($string) {
?>
    <script type='text/javascript'>
       $(function() {
          console.log(<?=json_encode($string); ?>);
       });
    </script>
<?php
}

class detWarning extends AbstractExternalModule {
    
    private $module_prefix = 'det_warning';
    private $module_global = 'detWarning';
    private $module_name = 'detWarning';
    
    public function __construct() {
            parent::__construct();
    }
    
    public function redcap_every_page_top($project_id) {
        $this->initGlobal();
        
        if (strpos(PAGE, 'Design/online_designer.php') !== false && $project_id != NULL && $_GET['page']) {
            $json = $this->loadJSON($_GET['page']);
            if ( empty($json) || ((strtotime('-1 day') - strtotime($json['loadDate'])) > 0) )
                $json = $this->parseDET($project_id);
            $this->passArgument('config',$json);
            $this->includeJs('designer.js');
            echo '<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/default.min.css">';
            echo '<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/highlight.min.js"></script>';
        }
        
        // Custom Config page
        if (strpos(PAGE, 'ExternalModules/manager/project.php') !== false && $project_id != NULL)
            $this->includeJs('config.js');
    }
    
    private function parseDET($project_id) {
        global $data_entry_trigger_url;

        $base = explode('redcap', __file__)[0];
        $file = $base . trim(str_replace('/','\\',$data_entry_trigger_url), '\\');
        $json = [
            'file' => $file,
            'content' => "",
            'usedElements' => [],
            'loadDate' => date("Y-m-d H:i")
        ];
        $contents = file_get_contents($file);
        if ($contents ) {
            $fields = REDCap::getFieldNames();
            $json['content'] = $contents;
            foreach($fields as $field) {
                $field = explode('____',$field)[0];
                if (strpos($contents, $field) !== FALSE)
                    array_push($json['usedElements'], $field);
            }
        }
        ExternalModules::setProjectSetting($this->module_prefix, $project_id, 'json', json_encode($json));
        return $json;
    }
    
    private function loadJSON($instrument) {
        $json = $this->getProjectSetting('json');
        $json = empty($json) ? null : (array)json_decode($json)->$instrument;
        return $json;
    }
    
    private function initGlobal() {
        $data = array(
            "modulePrefix" => $this->module_prefix,
        );
        echo "<script>var ".$this->module_global." = ".json_encode($data).";</script>";
    }

    private function passArgument($name, $value) {
        echo "<script>".$this->module_global.".".$name." = ".json_encode($value).";</script>";
    }
    
    private function includeJs($path) {
        echo '<script src="' . $this->getUrl($path) . '"></script>';
    }
}

?>
