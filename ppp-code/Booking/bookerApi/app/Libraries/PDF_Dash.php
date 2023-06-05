<?php
namespace App\Libraries;
use Codedge\Fpdf\Fpdf\Fpdf;
class PDF_Dash extends FPDF
{
    protected $dashArray = array();

    function SetDash($black = 0, $white = 0)
    {
        if($black == 0 && $white == 0) {
            $this->dashArray = array(0, 0);
        } else {
            $this->dashArray = array($black, $white);
        }
    }

    function _dashedline($x1, $y1, $x2, $y2, $dashlength = 2)
    {
        $space = $dashlength;
        $distance = sqrt(pow($x2 - $x1, 2) + pow($y2 - $y1, 2));
        $count = floor($distance / (2 * $dashlength));
        for ($i = 0; $i < $count; $i++) {
            $sx = $x1 + ($x2 - $x1) / $count * ($i * 2);
            $sy = $y1 + ($y2 - $y1) / $count * ($i * 2);
            $ex = $x1 + ($x2 - $x1) / $count * (($i * 2) + 1);
            $ey = $y1 + ($y2 - $y1) / $count * (($i * 2) + 1);
            $this->Line($sx, $sy, $ex, $ey);
        }
        $lastsegment = fmod($distance, $dashlength * 2);
        $sx = $x1 + ($x2 - $x1) / $count * ($i * 2);
        $sy = $y1 + ($y2 - $y1) / $count * ($i * 2);
        $ex = $x1 + ($x2 - $x1) / $count * ($i * 2) + $lastsegment;
        $ey = $y1 + ($y2 - $y1) / $count * ($i * 2) + $lastsegment;
        $this->Line($sx, $sy, $ex, $ey);
    }

    function Line($x1, $y1, $x2, $y2)
    {
        if(empty($this->dashArray)) {
            parent::Line($x1, $y1, $x2, $y2);
        } else {
            $this->_dashedline($x1, $y1, $x2, $y2, $this->dashArray[0] + $this->dashArray[1]);
        }
    }
}
?>