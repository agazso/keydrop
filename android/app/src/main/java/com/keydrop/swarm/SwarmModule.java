package com.keydrop;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.LifecycleEventListener;
import com.github.helmethair_co.keydrop_go.Keydropgo;
import android.content.ContextWrapper;
import org.json.JSONObject;

import java.util.Map;
import java.util.HashMap;

public class SwarmModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private ReactApplicationContext reactContext;
    public SwarmModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "Swarm";
    }

    @ReactMethod
    public void start() {
        final String appPath = this.reactContext.getFilesDir().getAbsolutePath();
        System.out.println("start application" + appPath);
        Keydropgo.StartNode(appPath);
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

    @Override
    public void onHostResume() {
        System.out.println("resume application");
    }

    @Override
    public void onHostPause() {
        System.out.println("pause application");
    }

    @Override
    public void onHostDestroy() {
        System.out.println("destroy application");
        System.out.println(Keydropgo.StopNode());
    }
}
