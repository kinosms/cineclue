package com.cineclue.app;

import android.app.AlertDialog;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onBackPressed() {
        showExitDialog();
    }

    private void showExitDialog() {
        new AlertDialog.Builder(this)
            .setTitle("CineClue")
            .setMessage("게임을 종료할까요?")
            .setNegativeButton("취소", null)
            .setPositiveButton("종료", (dialog, which) -> finish())
            .show();
    }
}