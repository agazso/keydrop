package com.keydrop;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.github.helmethair_co.keydrop_go.Keydropgo;
import android.content.ContextWrapper;
import org.json.JSONObject;

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

    @ReactMethod
    public void createIdentity(Promise promise) {
        final String identityJson = Keydropgo.CreateIdentity();
        try {
            final JSONObject jsonObject = new JSONObject(identityJson);

            WritableMap identity = new WritableNativeMap();
            identity.putString("publicKey", jsonObject.getString("publicKey"));
            identity.putString("privateKey", jsonObject.getString("privateKey"));
            identity.putString("address", jsonObject.getString("address"));

            promise.resolve(identity);
        } catch (Exception e) {
            promise.resolve(e.toString());
        }
    }
}
