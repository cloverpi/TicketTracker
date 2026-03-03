!macro customInstall
  DetailPrint "Installing dependency..."

  SetOutPath "$INSTDIR\resources\installers"
  ExecWait '"$OUTDIR\adsodbc_x86_64.exe" /s /v"/qn"' $0

  ${If} $0 != 0
    Abort
  ${EndIf}
!macroend