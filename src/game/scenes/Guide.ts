namespace game {
  export class Guide extends yyw.Base {
    private btnNext: eui.Button;
    private currentIndex: number = -1;
    private currentStep: Step1 | Step2 | Step3;
    private stepClasses = [Step1, Step2, Step3];

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.btnNext, async () => {
          await this.nextStep();
          if (this.currentIndex === this.stepClasses.length - 1) {
            this.btnNext.icon = "sprites_json.done";
          }
        });
      }

      this.nextStep();
    }

    private async nextStep() {
      if (this.currentStep) {
        await yyw.fadeOut(this.currentStep);
        yyw.removeElement(this.currentStep);
      }
      this.currentIndex++;
      if (this.currentIndex < this.stepClasses.length) {
        const Step = this.stepClasses[this.currentIndex];
        this.currentStep = new Step();
        this.body.addChildAt(this.currentStep, 0);
      } else {
        yyw.director.escape();
        yyw.update({ guided: true });
      }
    }
  }
}
