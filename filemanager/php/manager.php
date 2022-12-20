<?php

class Logger
{
	const FILENAME = "/log/logger.log";

	public static function log($data, $method = "")
	{
		$log = "[".date('Y-m-d H:i:s', time())."]\n[".$method."]\n";
		file_put_contents($_SERVER["DOCUMENT_ROOT"].self::FILENAME, $log.var_export($data, true)."\n\n", FILE_APPEND);
	}
}

class Manager
{
	public $path;

	public static function _list($path)
	{
		$result = [];
		$content = array_diff(scandir($path, SCANDIR_SORT_ASCENDING), array('..', '.'));
		Logger::log($content, __METHOD__);
		foreach ($content as $item) {
			$file_info = finfo_open(FILEINFO_MIME_TYPE);
			foreach (glob("*") as $filename) {
				$data = finfo_file($file_info, $path.$item);
			}
			finfo_close($file_info);

			$result[] = [
				'label' => $item,
				'type' => is_dir($path . $item) ? 'dir' : 'file',
				'mimeType' => $data
			];
		}
		return $result;
	}

	public static function _copy($source, $target)
	{
		return [];
	}

	public static function _open($source)
	{
		$file_info = finfo_open(FILEINFO_MIME_TYPE);
		foreach (glob("*") as $filename) {
			$data = finfo_file($file_info, $source);
		}
		finfo_close($file_info);

		return [
			'file' => $source,
			'mimeType' => $data,
			'content' => preg_match("/text|application\/json/", $data) ? file_get_contents($source, true) : ''
		];
	}

	public static function _save($filename, $content)
	{
		return (bool)file_put_contents($filename, $content, FILE_USE_INCLUDE_PATH);
	}

	public function __construct($args = null)
	{
        if ( isset($args['action']) ) {
            switch ($args['action']) {
                case "list":
                    $source = $_SERVER["DOCUMENT_ROOT"] . $args['source'] . "/";
                    echo json_encode(["ok" => true, 'dir' => self::_list($source)]);
                    break;
                case "copy":
                    $source = $_SERVER["DOCUMENT_ROOT"] . $args['source'];
                    $target = $_SERVER["DOCUMENT_ROOT"] . $args['target'];
                    echo json_encode(["ok" => true, 'dir' => self::_copy($source, $target)]);
                    break;
                case "open":
                    $source = $_SERVER["DOCUMENT_ROOT"] . $args['source'];
                    echo json_encode(["ok" => true, 'content' => self::_open($source)]);
                    break;
                case "save":
                    $data = $args['content'];
                    echo json_encode(["ok" => true, 'save' => self::_save($args['filename'], $data)]);
                    break;
            }
        }
	}
}

$manager = new Manager(array_merge($_GET, $_POST));