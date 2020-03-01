<?php

namespace App;

use App\Interfaces\Sluggable;
use Illuminate\Database\Eloquent\Model;

class Product extends Model implements Sluggable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'slug', 'description', 'price',
    ];

    /**
     * {@inheritdoc}
     */
    public function getSlugConfiguration() {
        return [
            'slug' => 'name',
        ];
    }
}
