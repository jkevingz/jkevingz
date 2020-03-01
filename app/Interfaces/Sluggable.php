<?php

namespace App\Interfaces;

interface Sluggable 
{

    /**
     * Return a keyed array with the configuration for the service to set the
     * slug. The key needs to be the slug field and the value must be the field
     * where the slug is going to take the value from.
     *
     * <code>
     * <?php
     * return ['slug' => 'title'];
     * ?>
     * </code>
     * 
     * @return array
     */
    public function getSlugConfiguration();

}
