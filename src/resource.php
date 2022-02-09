<?php
  $requestedFile = $_GET["file"];

  if(!isset($requestedFile)) {
    http_response_code(404);
    die("Invalid file: {$requestedFile}");
  } else if(!is_file($requestedFile)) {
    http_response_code(404);
    die("The file '{$requestedFile}' does not exist.");
  }


  $mimeMap = array('bm' => 'image/bmp', 'bmp' => 'image/bmp',
      'css' => 'text/css', 'gif' => 'image/gif', 'jpeg' => 'image/jpeg',
      'jpg' => 'image/jpeg', 'mjpg' => 'video/x-motion-jpeg', 'xml' => 'text/xml',
      'png' => 'image/png', 'js' => 'application/javascript', 'woff' => 'font/woff', 'tff' => 'font/ttf', 'svg' => 'image/svg+xml');

  class File {
      var $filepath, $mtime;
      var $dirname, $name, $extension;

      function __construct($file) {
          $this->filepath = $file;
          $this->mtime = filemtime($this);

          $path_parts = pathinfo($this);
          $this->dirname   = $path_parts['dirname'];
          $this->name      = $path_parts['basename'];
          $this->extension = strtolower($path_parts['extension']);
      }

      function get_etag() {
          return md5($this->mtime.$this);
      }

      function content() {
          ob_start();
          readfile($this);
          $content = ob_get_contents();
          ob_end_clean();
          return $content;
      }

      function __toString() {
          return (string)$this->filepath;
      }
  }

  $file = new File($requestedFile);

  if(!array_key_exists($file->extension, $mimeMap)) {
    die("Invalid file type: $file->extension");
  }

  $etag = $file->get_etag();
  $time = gmdate('r', $file->mtime);

  $notModifiedSince = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] == $time;

  $etagMatches = isset($_SERVER['HTTP_IF_NONE_MATCH']) && str_replace('"', '', stripslashes($_SERVER['HTTP_IF_NONE_MATCH'])) == $etag;

  if($notModifiedSince || $etagMatches){
      header('HTTP/1.1 304 Not Modified');
      exit();
  }

  header("Last-Modified: $time");
  header("Cache-Control: must-revalidate");
  header("Expires: $time");
  header("Etag: $etag");
  header("Content-type: ".$mimeMap[$file->extension]);

  echo $file->content();
