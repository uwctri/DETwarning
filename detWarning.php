<?php

namespace UWMadison\detWarning;
use ExternalModules\AbstractExternalModule;
use REDCap;

class detWarning extends AbstractExternalModule {
    
    private $module_global = 'detWarning';
    
    public function redcap_every_page_top($project_id) {
        $this->initGlobal();
        
        // Check if we are on the design page
        if ( $this->isPage('Design/online_designer.php') && $project_id != NULL && $_GET['page']) {
            $json = $this->loadJSON($_GET['page']);
            // Only parse through the DET once a day, doing it every time for any large DET would be slow
            if ( True|| empty($json) || empty($json["file"]) || ((strtotime('-1 day') - strtotime($json['loadDate'])) > 0) ) {
                $json = $this->parseDET($project_id);
            }
            $this->passArgument('config',$json);
            $this->includeJS('designer.js');
            $this->includeHilightJS();
        }
        
        // Custom Config page
        if ( $this->isPage('ExternalModules/manager/project.php') && $project_id != NULL) {
            $this->includeJS('config.js');
        }
    }
    
    private function parseDET($project_id) {
        global $data_entry_trigger_url;
        
        $base = explode('redcap', APP_PATH_DOCROOT)[0];
        $file = $base . str_replace('/',DIRECTORY_SEPARATOR,trim($data_entry_trigger_url,'/'));

        $json = [
            'file' => $file,
            'content' => "",
            'usedElements' => [],
            'loadDate' => date("Y-m-d H:i")
        ];
        if ( empty($data_entry_trigger_url) ) {
            $json['file'] = "";
            return $json;
        }
        $contents = file_get_contents($file);
        if ($contents) {
            $fields = REDCap::getFieldNames();
            
            if ( !$this->getSystemSetting('hide-code') ) {
                $json['content'] = $contents;
            }
            
            foreach($fields as $field) {
                $field = explode('____',$field)[0];
                if (strpos($contents, $field) !== FALSE) {
                    array_push($json['usedElements'], $field);
                }
            }
        }
        $this->setProjectSetting('json', json_encode($json));
        return $json;
    }
    
    private function loadJSON($instrument) {
        $json = $this->getProjectSetting('json');
        return empty($json) ? null : (array)json_decode($json);
    }
    
    private function initGlobal() {
        $data = json_encode([
            "prefix" => $this->getPrefix()
        ]);
        echo "<script>var {$this->module_global} = {$data};</script>";
    }
    
    private function passArgument($name, $value) {
        echo "<script>{$this->module_global}.{$name} = ".json_encode($value).";</script>";
    }
    
    private function includeJs($path) {
        echo "<script src={$this->getUrl($path)}></script>";
    }
    
    private function includeHilightJS() {
        $this->includeJS('highlight.js/highlight.min.js');
        echo '<link rel="stylesheet"  href="' . $this->getURL('highlight.js/default.min.css') . '">';
    }
}

?>
