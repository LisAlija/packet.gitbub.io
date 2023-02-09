// Action script...

// [Action in Frame 1]
stop ();

// [Action in Frame 3]
_root.updateTranscript();

// [Action in Frame 16]

// [Action in Frame 93]
_root.updateTranscript();

// [Action in Frame 328]
_root.updateTranscript();

// [Action in Frame 443]
_root.updateTranscript();

// [Action in Frame 563]
_root.updateTranscript();

// [Action in Frame 752]
_root.updateTranscript();

// [Action in Frame 896]
_root.updateTranscript();

// [Action in Frame 1028]
_root.updateTranscript();

// [Action in Frame 1107]
stop ();
_btn.onRelease = function ()
{
    this.enabled = false;
    pop_mc.gotoAndPlay(2);
};
_root.displayPageContent(_root.page_obj.content[0].content[_root.counter].resolveType);
