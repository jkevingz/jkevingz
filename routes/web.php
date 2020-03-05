<?php

// The routing will be taken care of by the frontend since this is meant to be
// a single page application.
Route::get('{all}', function () {
    return view('index');
})->where('all', '.*');
