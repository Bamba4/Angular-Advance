import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactifStateRoutingModule } from './reactif-state-routing.module';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { SingleCandidateComponent } from './components/single-candidate/single-candidate.component';
import { CandidateService } from './services/candidate.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CandidateListComponent, SingleCandidateComponent],
  imports: [CommonModule, ReactifStateRoutingModule, SharedModule],
  providers: [CandidateService],
})
export class ReactifStateModule {}
