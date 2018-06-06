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
        this.startNode();
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

    private void log(String msg) {
        System.out.println("keydrop: " + msg);
    }

    private void startNode() {
        final String appPath = this.reactContext.getFilesDir().getAbsolutePath();
        this.log("startNode, path: " + appPath);
        final String bootnodeURL = "";
        final String result = Keydropgo.StartNode(appPath, ":0", bootnodeURL);
        this.log("StartNode result: " + result);
    }

    @Override
    public void onHostResume() {
        this.log("resume application");
        this.startNode();
    }

    @Override
    public void onHostPause() {
        this.log("pause application");
        this.log(Keydropgo.StopNode());
    }

    @Override
    public void onHostDestroy() {
        this.log("destroy application");
        this.log(Keydropgo.StopNode());
    }
}
