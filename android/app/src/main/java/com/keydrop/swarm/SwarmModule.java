package com.keydrop;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.github.helmethair_co.keydrop_go.Keydropgo;
import android.content.ContextWrapper;

import java.util.Map;
import java.util.HashMap;

public class SwarmModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    public SwarmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Swarm";
    }

    @ReactMethod
    public void show(String message, Promise promise) {
        promise.resolve(message + " " + Keydropgo.StartNode(this.reactContext.getFilesDir().getAbsolutePath()));
    }
}
