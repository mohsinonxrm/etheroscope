import { Output, Component, EventEmitter, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from "../../_services/contract.service";
import { GraphService } from "../../_services/graph.service";
import { Wizard } from "clarity-angular";

@Component({
  selector: 'search-bar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../explorer.component.global.scss']
})

export class SearchBarComponent {
  @ViewChild("wizard") wizard: Wizard;
  @ViewChild("number") numberFi: any;

  @Output() exploreContractEvent = new EventEmitter<string>();
  // badRequest: boolean;
  graphService: any;
  matches: any;
  searchVariables: any;
  searchMatch: number;
  contractService: any;
  openWizard: boolean;
  constructor(private service: ContractService, private gs: GraphService) {
    this.contractService = service;
    this.searchMatch = 0;
    // this.badRequest = false;
    this.graphService = gs;
    this.openWizard = false;
    this.searchVariables = [];
  }

  searchContracts(pattern: string) {
    this.contractService.searchContracts(pattern, this.searchVariables).subscribe(
      (matches) => {
        if (JSON.stringify(this.matches) !== JSON.stringify(matches)) {
          this.matches = matches;
          this.graphService.userSearching = true;
        }
        if (this.matches.length === 0) {
          this.searchMatch = 0;
        } else if (this.matches.length <= this.searchMatch) {
          this.searchMatch = this.matches.length - 1;
        }
      },
      (error) => {
        this.matches = [];
        console.log(error);
      },
      () => {
    })
  }

  exploreContractMatches(searchbar: string) {
    let pattern;
    if (this.matches.length === 0) {
      pattern = searchbar;
    } else {
      pattern = '0x' + this.matches[this.searchMatch].contractHash;
    }
    this.exploreContract(pattern);
  }

  exploreContract(contract: string) {
    this.graphService.userSearching = false;
    if (contract[0] !== '0' && (contract[1] !== 'x' && contract[1] !== 'X') && contract.length !== 42) {
      console.log('bad request????')
      this.graphService.badRequest = true;
    } else {
      this.graphService.badRequest = false;
      this.exploreContractEvent.emit(contract);
    }
  }

  decSearch() {
    if (this.matches !== undefined) {
      if (this.searchMatch > 0 && this.searchMatch < this.matches.length) {
        this.searchMatch -= 1;
      }
    }
  }

  incSearch() {
    if (this.matches !== undefined) {
      if (this.searchMatch < 4 && this.searchMatch < this.matches.length) {
        this.searchMatch += 1;
      }
    }
  }

  searchMatchFn(index: number) {
    if (index === this.searchMatch) {
      return '#eaeaea';
    }
    return '#fafafa';
  }

  advancedConstraints = {
    varCons: [],
    number: ''
  };

  addNewVariableConstraint() {
    this.advancedConstraints.varCons.push({
      name: '',
      startTime: 0,
      endTime: 4000000000,
      min: 0,
      max: 1000000000
    });
  }

  removeVariableConstraint(index: number) {
    this.advancedConstraints.varCons.splice(index, 1);
  }

  advancedSearchDone() {
    this.searchVariables = this.advancedConstraints.varCons;
  }

  checkCursorInSearchArea(event: any) {                                                             
     if (event.target.id !== 'searchBar') {
       this.graphService.userSearching = false;
     }
   }

}
