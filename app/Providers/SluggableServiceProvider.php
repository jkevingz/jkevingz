<?php

namespace App\Providers;

use App\Interfaces\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

class SluggableServiceProvider extends ServiceProvider
{

    public function boot() {
        // Generate a unique slug for models that implements the Sluggable 
        // interface. 
        Event::listen('eloquent.saving: *', function ($event, $payload) {
            // Annoyingly, the payload is not always the model object but an 
            // array with one item that is the object. So more validation needs
            // to be done to ensure this will only work when needed. 
            $model = null;
            if (is_array($payload)) {
                $model = $payload[0];
            }
            if ($payload instanceof Model) {
                $model = $payload;
            }
            if (empty($model) || !($model instanceof Sluggable)) {
                return;
            }
            
            foreach ($model->getSlugConfiguration() as $slug => $after) {
                if (empty($model->{$after})) {
                    continue;
                }

                $value = $original = Str::slug($model->{$after}, '-');
                $count = 0;
                while ($model->all()->where($slug, $value)->where($model->getKeyName(), '<>', $model->getKey())->isNotEmpty()) {
                    $value = $original . '-' . ++$count;
                }

                $model->{$slug} = $value;
            }
        });
    }
}
