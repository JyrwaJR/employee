<?php
require_once "lib/random.php";


class API_Handler
{
	public $BANKURL;
	public $HOST;
	public $HOSTIP;
	public $REMOTE_ADDR;
	public $SERVER_ADDR;
	
	
	function __construct() {
		$this->BANKURL = htmlentities(trim(isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null),ENT_QUOTES);
		$this->HOST = $_SERVER['SERVER_NAME'];
		$this->HOSTIP = $_SERVER['SERVER_ADDR'];
		$this->SERVER_ADDR = $_SERVER['SERVER_ADDR'];//???
		$this->REMOTE_ADDR = htmlentities(trim($_SERVER['REMOTE_ADDR']),ENT_QUOTES);//$_SERVER['REMOTE_ADDR'];
		
				
	}
	
	function getSSKey($subsystem){
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
		
		
		$paramarray=array();
		$paramarray[0]=$subsystem;
		
		$sqlselectSSkey="SELECT client_key from pao.gras_sub_system where subsys_name=$1";
		
		$resselectSSkey=pg_prepare($con,"sqlselectSSkey",$sqlselectSSkey);
		$result=pg_execute($con,"sqlselectSSkey",$paramarray);
		$row = pg_fetch_row($result); 
		if($row[0]==''){
			
		}
	}
	
	

	public function Auth($param)
	{

		$conn = new PgConnect();
		$con = $conn->ConnectPG();
		$dbparam = array();
		$dbparam[0] = $param['app_key'];

		$client_pwd=base64_decode($param['app_pwd']);
		
		//$client_pwd="password123";// "DATx234lkj-password123DAT12345!#";
		
		$sqlauth = "SELECT app_pwd FROM cpps.client_api WHERE app_key = $1 AND flag='1' ";
		$result = pg_prepare($con, "sqlauth", $sqlauth);
		$result = pg_execute($con, "sqlauth", $dbparam);
		$hash = pg_fetch_object($result)->app_pwd;

		if (password_verify($client_pwd, $hash)) {
			return true;
		} else {
			return false;
			
		}

		//-------------------------------------------------------
		//Generate Hash Password using bcrypt
		//-------------------------------------------------------
		// default cost = 10 ... the algorithmic cost that should be used
		// $options = ['cost' => 12,];
		// echo password_hash("password123", PASSWORD_BCRYPT, $options);
	}

	function getTokenState($param){
		if ($this->Auth($param)){
			//Valid Credential
		}
		else{
			$returnArray = Api_Response::getResponse('100');
			return json_encode($returnArray);
		}
		
		
		if($this->validate_token($param)){
			$returnArray = Api_Response::getResponse('311');
			return json_encode($returnArray);
		}
		else{
			$returnArray = Api_Response::getResponse('312');
			return json_encode($returnArray);
		}
	}

	function getToken($param){
		
		
		//echo base64_encode("password123");exit;

		if ($this->Auth($param)){
			//Valid Credential
		}
		else{
			$returnArray = Api_Response::getResponse('100');
			return json_encode($returnArray);
		}
	
		
		//Generate Token
		//--------------
		//THE HASHED VALUE OF API KEY MATCHES
		$token=base64_encode(random_bytes(24));

		
		//DATABASE CONNECT 
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
			
		///CREATE TIMESTAMP
		$t	=time();
		$dt	=date("Y-m-d",$t);
		$tm	=date("H:i:s");
		$TS	=date("Y-m-d H:i:s");// $dt." ".$tm;
		
		$Tokarray = array();
		$Tokarray[0]=$param['app_key'];
		$Tokarray[1]=$TS;
		$Tokarray[2]=$token;
		
		$sqlinsertToken="INSERT INTO cpps.tokens(client, tstamp, token) VALUES ($1, $2, $3)";
		$resinsertToken=pg_prepare($con,"sqlinsertToken",$sqlinsertToken);
		$result=pg_execute($con,"sqlinsertToken",$Tokarray);
		//return "TOKEN$".$token."$";	

		$returnarray=array("token"=>$token);
		$data=json_encode($returnarray);
		
		pg_close($con);
		return $data;
							
				
	}	
	
	
	


	
	
	function get_pension_class($param){


		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			//$parray[0]=1;
			$SQLGETPCLASS="select * from cpps.pension_class";
			$RESSQLGETPCLASS=pg_prepare($con,"SQLGETPCLASS",$SQLGETPCLASS);
			$RESULT=pg_execute($con,"SQLGETPCLASS",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['pcode']=$row[0];
					$data[$i]['pdesc']=$row[1];				
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}

	}
	
	
	
	
	function get_facial_pesioner_dlc($param){
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			
			$val=$this->validate_param($param);
						
						
			if($val !=1){
				$returnArray = Api_Response::getResponse("$val");
						return json_encode($returnArray);
			}
			
			
			
			$parray[0]=$param['process_flag'];
			//$SQLGETPDLC="select * from cpps.facial_pensioner_dlc where process_flag=? LIMIT 500";

			$SQLGETPDLC=" 	select fpd.* from cpps.facial_pensioner_dlc fpd 
				inner join cpps.facial_pensioner_regn fpr on fpr.ppo_no=fpd.ppo_no and fpr.process_flag='00' 
				where fpd.process_flag=$1 LIMIT 500 ";



			$RESSQLGETPDLC=pg_prepare($con,'SQLGETPDLC',$SQLGETPDLC);
			$RESULT=pg_execute($con, 'SQLGETPDLC',$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['certificate_id']=$row[0];
					$data[$i]['certificate_datetime']=$row[1];		
					$data[$i]['device_id']=$row[2];		
					$data[$i]['device_name']=$row[3];		
					$data[$i]['ppo_no']=$row[4];
					$data[$i]['pname']=$row[5];
					$data[$i]['pension_class']=$row[6];		
					$data[$i]['place']=$row[7];	
					$data[$i]['nec']=$row[8];
					$data[$i]['nmc']=$row[9];
					$data[$i]['process_flag']=$row[10];	
					$data[$i]['remarks']=$row[11];						
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}


	
	
	
	
	function get_pensioner_dlc($param){


		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]="01";
			
			

			//$SQLGETPDLC="select * from cpps.facial_pensioner_dlc where process_flag=$1";
			
			
			$SQLGETPDLC="SELECT fpd.certificate_id, fpd.certificate_datetime, fpd.device_id, fpd.device_name, fpd.ppo_no, fpd.pname, fpd.pension_class, 
						fpd.place, fpd.nec, fpd.nmc, fpd.process_flag, fpd.remarks, fpr.ppo_regn_no, fpd.created_at, fpd.updated_at
						FROM cpps.facial_pensioner_dlc fpd
						left outer join cpps.facial_pensioner_regn fpr on fpr.ppo_no=fpd.ppo_no and fpr.process_flag='00'
						where fpd.process_flag=$1 ";//changes on april 2024
			
			
			$RESSQLGETPDLC=pg_prepare($con,"SQLGETPDLC",$SQLGETPDLC);
			$RESULT=pg_execute($con,"SQLGETPDLC",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['certificate_id']=$row[0];
					$data[$i]['certificate_datetime']=$row[1];		
					$data[$i]['device_id']=$row[2];		
					$data[$i]['device_name']=$row[3];		
					$data[$i]['ppo_no']=$row[4];
					$data[$i]['pname']=$row[5];
					$data[$i]['pension_class']=$row[6];		
					$data[$i]['place']=$row[7];	
					$data[$i]['nec']=$row[8];
					$data[$i]['nmc']=$row[9];
					$data[$i]['process_flag']=$row[10];	
					$data[$i]['remarks']=$row[11];						
					$data[$i]['ppo_regn_no']=$row[12];//changes
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}



	}
	

	function get_pensioner_photo($param){

		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			//$parray[1]="1";
			$SQLGETPIMG="select ppo_no, ppo_seq_no, photo  from cpps.facial_pensioner_photo where ppo_no=$1 ";
			$RESSQLGETPIMG=pg_prepare($con,"SQLGETPIMG",$SQLGETPIMG);
			$RESULT=pg_execute($con,"SQLGETPIMG",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['ppo_no']=$row[0];
					$data[$i]['ppo_seq_no']=$row[1];
					$data[$i]['photo']=pg_unescape_bytea($row[2]);//base64_encode($row[2]);
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}



	}

	function push_fc_pensioner_dlc($param){


		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$val=$this->validate_param($param);						
			if($val !=1){
				$returnArray = Api_Response::getResponse("$val");
					return json_encode($returnArray);
			}
			
			
			$dparam=array();
			$dparam[0]=$param['certificate_id'];
			$dparam[1]=$param['certificate_datetime'];
			 $dparam[2]=$param['device_id'];
			$dparam[3]=$param['device_name'];
			$dparam[4]=$param['ppo_no'];
			$dparam[5]=$param['pname'];
			$dparam[6]=$param['pension_class'];
			$dparam[7]=$param['place'];
			$dparam[8]=$param['nec'];
			$dparam[9]=$param['nmc'];
			$dparam[10]=$param['process_flag'];
			$dparam[11]=$param['remarks'];
			$dparam[12]=date("Y-m-d H:i:s");
			
	
			//	print_r($data);
			
			 $sqlinsertPDLC="INSERT INTO cpps.facial_pensioner_dlc(
			certificate_id, certificate_datetime, device_id, device_name,
			ppo_no, pname, pension_class, place, nec, nmc, process_flag, remarks, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)"; 
			/* $sqlinsertProfile="INSERT INTO cpps.pensioner_trans(
			tran_id, tran_date)
			VALUES ($1,$2)"; */
			$ressqlinsertPDLC=pg_prepare($con,"sqlinsertPDLC",$sqlinsertPDLC);
			$result=pg_execute($con,"sqlinsertPDLC",$dparam);	

	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}
	}
	
	
	function push_process_status($param){




		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			$dparam=array();
			
			
			
			switch ($param['action']){
				case 'dlc':
				
				
						
						$dparam[0]=$param['process_flag'];
						$dparam[1]=date("Y-m-d H:i:s");
						$dparam[2]=$param['certificate_id'];
						$sqlUPPDLC="UPDATE cpps.facial_pensioner_dlc
						SET  process_flag=$1, updated_at=$2
						WHERE certificate_id=$3"; 
						
						//$resssqlUPPDLCC=pg_prepare($con,$sqlUPPDLC);
						//$result=pg_execute($resssqlUPPDLCC,$dparam);	

						$resssqlUPPDLCC=pg_prepare($con,'sqlUPPDLC',$sqlUPPDLC);
						$result=pg_execute($con,'sqlUPPDLC',$dparam);

				   
						if($result){
							$returnArray = Api_Response::getResponse('306');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('307');
							return json_encode($returnArray);
						}
						break;
				case 'registration':
						$val=$this->validate_param($param);
						
						
						if($val !=1){
							$returnArray = Api_Response::getResponse("$val");
							return json_encode($returnArray);
						}
						$dparam[2]=$param['process_flag'];
						$dparam[3]=date("Y-m-d H:i:s");
						$dparam[0]=$param['ppo_no'];
						$dparam[1]=$param['ppo_regn_no'];
						
						
						//$dparam[0]=$param['process_flag'];
						//$dparam[1]=date("Y-m-d H:i:s");
						//$dparam[2]=$param['ppo_no'];
						//$dparam[3]=$param['ppo_regn_no'];
						
						
						$sqlUPPPR="UPDATE cpps.facial_pensioner_regn
						SET  process_flag=$1, updated_at=$2
						WHERE ppo_no=$3 and ppo_regn_no=$4 "; 
						$resssqlUPPDLCC=pg_prepare($con,'sqlUPPPR',$sqlUPPPR);
						$result=pg_execute($con,'sqlUPPPR',$dparam);

					
						if($result){
							$returnArray = Api_Response::getResponse('306');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('307');
							return json_encode($returnArray);
						}
						break;
						
						
						

				case 'del_sym_selfcertication':
						$val=$this->validate_param($param);
						if($val !=1){
							$returnArray = Api_Response::getResponse("$val");
							return json_encode($returnArray);
						}

						$dparam[0]=$param['data_id'];
						$dparam[1]=$param['ppo_no'];
						
						$sqlSymCertDel=" DELETE FROM cpps.sym_selfcertication	WHERE data_id=$1 and ppo_no=$2 ";
						$resSymCertDel=pg_prepare($con,"sqlSymCertDel",$sqlSymCertDel);
						$result=pg_execute($con,"sqlSymCertDel",$dparam);
				   		
						if($result){
							$returnArray = Api_Response::getResponse('200');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('000');
							return json_encode($returnArray);
						}
						break;
						
				default:
						$response=json_encode("Invalid Action");
						
			}
			
			
			
			
			
			
			
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);			
		}
		
	}
	
	

	function dlcreject($param){
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$val=$this->validate_param($param);
						
						
			if($val !=1){
				$returnArray = Api_Response::getResponse("$val");
						return json_encode($returnArray);
			}
			$parray=array();
			$parray[0]=date("Y-m-d H:i:s");
			$parray[1]=$param['ppo_no'];
			$parray[2]='01';
			
			
			$sql="UPDATE cpps.facial_pensioner_dlc
			SET process_flag='02', updated_at=$1
			WHERE ppo_no=$2 and process_flag=$3 "
			$RES=pg_execute($con, 'RESSQL',$parray);
			
			if($RES){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
			
			
		}
	}
	
	
	
	function pensioner_trans($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			$dparam=array();
			$dparam[0]=$param['tran_id'];
			$dparam[1]=$param['tran_date'];
			 $dparam[2]=$param['tran_type'];
			$dparam[3]=$param['pda_code'];
			$dparam[4]=$param['ppo_no'];
			$dparam[5]=$param['ppo_reg_no'];
			$dparam[6]=$param['pname'];
			$dparam[7]=$param['pension_class'];
			$dparam[8]=$param['bank_accno'];
			$dparam[9]=$param['nec'];
			$dparam[10]=$param['nmc'];
			$dparam[11]=$param['auth_date'];
			$dparam[12]=$param['mob_no'];
			$dparam[13]=$param['gender'];
			$dparam[14]=$param['d_o_birth'];
			$dparam[15]=$param['process_status'];
			$dparam[16]=date("Y-m-d H:i:s"); 
	
			//	print_r($data);
			
			 $sqlinsertTrans="INSERT INTO cpps.pensioner_trans(
			tran_id, tran_date, tran_type, pda_code, ppo_no, ppo_reg_no, pname, pension_class, bank_accno, nec, nmc, auth_date, mob_no, gender, d_o_birth, process_status,created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,$17)"; 
			/* $sqlinsertProfile="INSERT INTO cpps.pensioner_trans(
			tran_id, tran_date)
			VALUES ($1,$2)"; */
			$resinsertProfile=pg_prepare($con,"sqlinsertTrans",$sqlinsertTrans);
			$result=pg_execute($con,"sqlinsertTrans",$dparam);	

	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	function check_Sync_date($param, $tablename){		
		
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			
			
			
			
			
			
			$SQLGETpDEtails="";
			switch ($tablename){
				case 'pensioner_profile':
					$parray[0]=$param['ppo_no'];
					$SQLGETpDEtails="select sync_date from cpps.pensioner_profile where ppo_no=$1";
					break;
				case 'pensioner_pdetails':
					$parray[0]=$param['ppo_no'];
					$SQLGETpDEtails="select sync_date from cpps.pensioner_pdetails where ppo_no=$1";
					break;
				case 'photo_tab':
					$parray[0]=$param['ppo_no'];
					$SQLGETpDEtails="select sync_date from cpps.photo_tab where ppo_no=$1";
					break;
				case 'fingerprint':
					//$parray[0]=$param['ppo_no'];
					$parray[0]=$param['fingerprt_id'];
					
					$SQLGETpDEtails="select sync_date from cpps.fingerprint where fingerprt_id=$1";
					break;
					
				case 'appspan':
					$parray[0]=$param['ID'];
					$SQLGETpDEtails="select sync_date from cpps.appspan where id=$1";
					break;

				case 'kiosk_mst':
					$parray[0]=$param['kiosk_ip'];
					$SQLGETpDEtails="select sync_date from cpps.kiosk_mst where kiosk_ip=$1";
					break;

				case 'limit_ppolist':
					$parray[0]=$param['ppo_no'];
					$parray[1]=$param['limit_code'];
					$parray[2]=$param['d_o_effect'];
					
					$SQLGETpDEtails="select sync_date from cpps.limit_ppolist where ppo_no=$1 and limit_code=$2 and d_o_effect=$3 ";
					break;

				case 'necertisp':
					$parray[0]=$param['ppo_no'];
					$SQLGETpDEtails="select sync_date from cpps.necertisp where ppo_no=$1";
					break;

				case 'photo_tab':
					$parray[0]=$param['ppo_no'];
					$parray[1]=$param['d_o_entry'];
					$parray[2]=$param['photo_type'];
					$SQLGETpDEtails="select sync_date from cpps.photo_tab where ppo_no=$1 and d_o_entry=$2 and photo_type=$3 ";
					
					
					
					break;


//
					
				default:
					$response=json_encode("Invalid Action");
			}
					
			
			
			
			$RESGETpDEtails=pg_prepare($con,"SQLGETpDEtails",$SQLGETpDEtails);
			$RESULT=pg_execute($con,"SQLGETpDEtails",$parray);
			$row = pg_fetch_row($RESULT);
			
			$sync_date=$row[0];		
			
			
			if($sync_date==null)
				return true;
			
			if($param['sync_date']<=$sync_date)
				return false;
			else	
				return true; 
		
	}
	
	function get_facial_pensioner_regn($param){
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$dbparam=array();
			$dbparam[0]=$param['process_flag'];
			//$dbparam[1]='1';
			//$dbparam[1]='1';
			
			$sqlgetppr="
			

			
			SELECT A.ppo_no,A.ppo_regn_no,B.ppo_seq_no,B.photo FROM 
			cpps.facial_pensioner_regn A
			INNER JOIN cpps.facial_pensioner_photo B ON
			A.ppo_no=b.ppo_no 
			where A.process_flag=$1 
			and coalesce(B.ppo_seq_no,0)=(SELECT coalesce(max(ppo_seq_no),0) as ppo_seq_no FROM cpps.facial_pensioner_photo B2 where B2.ppo_no=B.ppo_no)
			ORDER BY A.ppo_no ASC			
			
			
			
			
			";
			$RESsqlgetppr=pg_prepare($con,"sqlgetppr",$sqlgetppr);
			$RESULT=pg_execute($con,"sqlgetppr",$dbparam);
			$data=array();
			$i=0;
			while($row=pg_fetch_row($RESULT)){
				$data[$i]['ppo_no']=$row[0];
				$data[$i]['ppo_regn_no']=$row[1];
				$data[$i]['ppo_seq_no']=$row[2];
				$data[$i]['photo']=pg_unescape_bytea($row[3]);
				
				$i++;
			}
			if($data[0]['ppo_no']==""){
					$returnArray = Api_Response::getResponse('310');
					return json_encode($returnArray);exit;
			}
			$retData=json_encode($data);
			pg_close($con);
			return $retData;
			
			
		}
	}
	
	
/*
 	function push_photo_tab($param){
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['dno'];
			$data[2]=$param['d_o_entry'];
			$data[3]=$param['photo_type'];
			$data[4]=$param['entry_ddtls'];
			$data[5]=$param['sync_date'];
			$data[6]=date("Y-m-d H:i:s");
			$data[7]=date("Y-m-d H:i:s");
			if(!$this->check_Sync_date($param, 'photo_tab'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			$sqlinsertPPhoto="INSERT INTO cpps.photo_tab(
			ppo_no, dno, d_o_entry, photo_type, entry_ddtls, sync_date, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5,$6,$7,$8)
			ON CONFLICT ON CONSTRAINT photo_tab_pkey 
			DO
			UPDATE
			set dno=EXCLUDED.dno,photo_type=EXCLUDED.photo_type,entry_ddtls=EXCLUDED.entry_ddtls,sync_date=EXCLUDED.sync_date,updated_at=EXCLUDED.updated_at
			";
			$resinsertHistory=pg_prepare($con,"sqlinsertPPhoto",$sqlinsertPPhoto);
			$result=pg_execute($con,"sqlinsertPPhoto",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
			
	}
*/
	
	function pensioner_photo($param){
		


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['ppo_seq'];
			$data[2]=$param['photo'];
			$data[3]=$param['flag'];
			$data[4]=date("Y-m-d H:i:s");
			$data[5]=$param['sync_date'];
			
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			$parray[1]=$param['ppo_seq'];
			$SQLGETpDEtails="select sync_date from cpps.pensioner_photo where ppo_no=$1 and ppo_seq=$2";
			$RESGETpDEtails=pg_prepare($con,"SQLGETpDEtails",$SQLGETpDEtails);
			$RESULT=pg_execute($con,"SQLGETpDEtails",$parray);
			$row = pg_fetch_row($RESULT);
			
			$sync_date=$row[0];
			
			if($param['sync_date']<=$sync_date){
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);		
				
			}			
			
			$sqlinsertPPhoto="INSERT INTO cpps.pensioner_photo(ppo_no, ppo_seq, photo, flag, created_at,sync_date)
			VALUES ($1, $2, $3, $4, $5,$6)
			ON CONFLICT ON CONSTRAINT pensioner_photo_pkey 
			DO
			UPDATE
			set photo=EXCLUDED.photo,flag=EXCLUDED.flag,updated_at=EXCLUDED.updated_at	
			";
			$resinsertHistory=pg_prepare($con,"sqlinsertPPhoto",$sqlinsertPPhoto);
			$result=pg_execute($con,"sqlinsertPPhoto",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}

	function pensioner_history($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			
			
			$data=array();
			$data[0]=$param['ppo_reg_no'];
			$data[1]=$param['ppo_seq'];
			$data[2]=$param['pname'];
			$data[3]=$param['pension_class'];
			$data[4]=$param['bank_accno'];
			$data[5]=$param['mob_no'];
			$data[6]=$param['gender'];
			$data[7]=$param['d_o_birth'];
			$data[8]=date("Y-m-d H:i:s");
			
			$sqlinsertHistory="INSERT INTO cpps.pensioner_history(ppo_reg_no, ppo_seq, pname, pension_class, bank_accno,mob_no, gender, d_o_birth, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)";
			$resinsertHistory=pg_prepare($con,"sqlinsertHistory",$sqlinsertHistory);
			$result=pg_execute($con,"sqlinsertHistory",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	function push_profile_details($param){

		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			} */
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['name'];
			$data[2]=$param['d_o_birth'];
			$data[3]=$param['d_o_exp'];
			$data[4]=$param['pension_class'];
			$data[5]=$param['drawer_name'];
			$data[6]=$param['bank_branch'];
			$data[7]=$param['bank_accno'];
			$data[8]=$param['mob_no'];
			$data[9]="00";//Valid
			$data[10]=date("Y-m-d H:i:s");
			$data[11]=$param['sync_date'];
			$data[12]=$param['address'];
			$data[13]=$param['sex'];
			$data[14]=$param['d_o_ret'];
			$data[15]=$param['d_o_lpdrawn'];
			$data[16]=$param['quali_service'];
			$data[17]=$param['penclose_flag'];
			$data[18]=$param['penclosed_detail'];
			
			
		 	if(!$this->check_Sync_date($param, 'pensioner_profile'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}	 
			
			
			$sqlinsertProfile="INSERT INTO cpps.pensioner_profile(
			ppo_no, name, d_o_birth, d_o_exp, pension_class, drawer_name, bank_branch, bank_accno,mob_no,flag,created_at,sync_date,address,sex,d_o_ret,d_o_lpdrawn,quali_service,penclose_flag,penclosed_detail)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
			ON CONFLICT ON CONSTRAINT pensioner_profile_pkey 
			DO
			UPDATE
			set name=EXCLUDED.name,d_o_birth=EXCLUDED.d_o_birth,d_o_exp=EXCLUDED.d_o_exp,pension_class=EXCLUDED.pension_class,drawer_name=EXCLUDED.drawer_name,bank_branch=EXCLUDED.bank_branch,bank_accno=EXCLUDED.bank_accno,mob_no=EXCLUDED.mob_no,address=	EXCLUDED.address, sex=	EXCLUDED.sex, d_o_ret=EXCLUDED.d_o_ret,d_o_lpdrawn=EXCLUDED.d_o_lpdrawn,quali_service=EXCLUDED.quali_service,penclose_flag=EXCLUDED.penclose_flag,penclosed_detail=EXCLUDED.penclosed_detail,sync_date=EXCLUDED.sync_date
			";
			$resinsertToken=pg_prepare($con,"sqlinsertProfile",$sqlinsertProfile);
			$result=pg_execute($con,"sqlinsertProfile",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	function push_pen_registration($param){

	//$photo=$param['photo'];
	//$hexString = '0xffd8ff';
	//$binary = hex2bin(substr($hexString, 2));
	//$binary=hex2bin(base64_decode($photo));
	//$hex=bin2hex(base64_decode($param['photo']));
	//return json_encode($hex);
	
	
	if($this->validate_token($param)){

			$param['ppo_no']=isset($param['ppo_no'])?$param['ppo_no']:'';
			
			$val=$this->validate_param($param);
						
						
			if($val !=1){
				$returnArray = Api_Response::getResponse("$val");
						return json_encode($returnArray);
			}
			
			
			$ppo_seq_no=$this->photoSeq($param['ppo_no']);
	



			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			pg_query("BEGIN");

			try{

			$dparam=array();
			$dparam[0]=$param['ppo_no'];//isset($param['ppo_no'])?$param['ppo_no']:''; 
			
			
			$dparam[1]=isset($param['ppo_regn_no'])?$param['ppo_regn_no']:'';
			$dparam[2]=isset($param['process_flag'])?$param['process_flag']:'';
			$dparam[3]=date("Y-m-d H:i:s");
			
			//00-Valid
			//01-Process


			//Registration 
			$sqlinsertregn="INSERT INTO cpps.facial_pensioner_regn(ppo_no, ppo_regn_no, process_flag, created_at) VALUES($1, $2, $3, $4)"; 
			$ressqlinsertregn=pg_prepare($con,"sqlinsertregn",$sqlinsertregn);
			$result=pg_execute($con,"sqlinsertregn",$dparam);			

			//Registraton Photo 
			$dparamPhoto=array();
			$dparamPhoto[0]=$param['ppo_no'];
			$dparamPhoto[1]=$ppo_seq_no;
			//$dparamPhoto[2]=$param['photo'];//pg_unescape_bytea($param['photo']);
			//$dparamPhoto[2]=hex2bin(base64_decode($param['photo']));
			
			//$hex=bin2hex(base64_decode($param['photo']));
			//$dparamPhoto[2]=hex2bin($hex);
			//$dparamPhoto[2]=bin2hex(base64_decode($param['photo']));
			$dparamPhoto[2]=pg_escape_bytea($param['photo']);//pg_unescape_bytea($param['photo']);
			$dparamPhoto[3]=null;//$param['flag'];
			$dparamPhoto[4]=date("Y-m-d H:i:s");		


			//set old flag=0
			
			
			
			//insert update
			//-------------
			$sqlinsertPhoto="INSERT INTO cpps.facial_pensioner_photo(ppo_no, ppo_seq_no, photo, flag, created_at) VALUES($1, $2, $3, $4, $5)
			"; 
			//$sqlinsertPhoto="INSERT INTO cpps.facial_pensioner_photo(ppo_no, ppo_seq_no) VALUES($1, $2) "; 
			$ressqlinsertPhoto=pg_prepare($con,"sqlinsertPhoto",$sqlinsertPhoto);
			$resultPhoto=pg_execute($con,"sqlinsertPhoto",$dparamPhoto);
			
			pg_query("COMMIT");
			


		}
		catch (Exception  $ex){
			pg_query("ROLLBACK");


			$returnArray = Api_Response::getResponse('302');//Insertion Failed
			return json_encode($returnArray);
		}	   


			if($result && $resultPhoto){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}



			
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
		}

	}



function push_pensioner_pdetails($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			
			$data[1]=$param['taxable'];
			$data[2]=$param['phone_no'];
			$data[3]=$param['mobile_no'];
			$data[4]=$param['community'];
			$data[5]=$param['pan_no'];
			$data[6]=$param['caddress'];
			$data[7]=$param['entry_date'];
			$data[8]=$param['pandt_birth'];//==''?null:$param['pandt_birth']);
			$data[9]=$param['sync_date'];
			$data[10]=date("Y-m-d H:i:s");
			$data[11]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'pensioner_pdetails'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}	 
			
			
			
			
			$sqlinsertPPdetails="
				INSERT INTO cpps.pensioner_pdetails(ppo_no, taxable, phone_no, mobile_no, community, pan_no, caddress, entry_date, pandt_birth, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
				";
			
			
			
			
			$resinsert=pg_prepare($con,"sqlinsertPPdetails",$sqlinsertPPdetails);
			$result=pg_execute($con,"sqlinsertPPdetails",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}



	function push_fingerprint($param){

		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			$data=array();
			$data[0]=$param['fingerprt_id'];
			$data[1]=$param['finger_imp'];
			$data[2]=$param['ppo_no'];
			$data[3]=trim($param['status']);
			$data[4]=$param['entry_dt'];
			$data[5]=$param['sync_date'];
			$data[6]=date("Y-m-d H:i:s");
			$data[7]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'fingerprint'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertFingerprint="
				INSERT INTO cpps.fingerprint(fingerprt_id, finger_imp, ppo_no, status, entry_dt, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )
				";
			
			$resinsert=pg_prepare($con,"sqlinsertFingerprint",$sqlinsertFingerprint);
			$result=pg_execute($con,"sqlinsertFingerprint",$data);		
			
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	



	function push_app_span($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			
			$data=array();
			$data[0]=$param['ID'];
			$data[1]=$param['d_o_change'];
			$data[2]=$param['no_of_months'];
			$data[3]=$param['sync_date'];
			$data[4]=date("Y-m-d H:i:s");
			//$data[7]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'appspan'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}	

			
			$sqlinsertAppspan="
				INSERT INTO cpps.appspan(id, d_o_change, no_of_months, sync_date, created_at)
				VALUES ($1, $2, $3, $4, $5 )
				";
			
			$resinsert=pg_prepare($con,"sqlinsertAppspan",$sqlinsertAppspan);
			$result=pg_execute($con,"sqlinsertAppspan",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}



	function push_kiosk_mst($param){

		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			$data=array();
			$data[0]=$param['kiosk_ip'];
			$data[1]=$param['kiosk_name'];
			$data[2]=$param['kiosk_location'];
			$data[3]=$param['status'];
			$data[4]=$param['mchslno'];
			$data[5]=$param['sync_date'];
			$data[6]=date("Y-m-d H:i:s");
			$data[7]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'kiosk_mst'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertKioskMst="
				INSERT INTO cpps.kiosk_mst(kiosk_ip, kiosk_name, kiosk_location, status, mchslno, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )
				";
			
			$resinsert=pg_prepare($con,"sqlinsertKioskMst",$sqlinsertKioskMst);
			$result=pg_execute($con,"sqlinsertKioskMst",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}




	function push_limit_ppolist($param){


		$this->WriteAccessCodeDV($param);

		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['limit_code'];
			$data[2]=$param['d_o_effect'];
			$data[3]=$param['end_date'];
			$data[4]=$param['employed_details'];
			$data[5]=$param['flag'];
			$data[6]=$param['sync_date'];
			$data[7]=date("Y-m-d H:i:s");
			$data[8]=date("Y-m-d H:i:s");
			
			$this->WriteAccessCodeDV($param);
			
		 	if(!$this->check_Sync_date($param, 'limit_ppolist'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertLimitppo="
				INSERT INTO cpps.limit_ppolist(ppo_no, limit_code, d_o_effect, end_date, employed_details, flag, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 )
				ON CONFLICT ON CONSTRAINT limit_ppolist_pkey
				DO UPDATE set end_date=EXCLUDED.end_date, employed_details=EXCLUDED.employed_details, flag=EXCLUDED.flag, sync_date=EXCLUDED.sync_date, updated_at=EXCLUDED.updated_at
				
				";
			
			$resinsert=pg_prepare($con,"sqlinsertLimitppo",$sqlinsertLimitppo);
			$result=pg_execute($con,"sqlinsertLimitppo",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	


	function push_necertisp($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['d_o_effect'];
			$data[2]=$param['flag'];
			$data[3]=$param['sync_date'];
			$data[4]=date("Y-m-d H:i:s");
			$data[5]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'necertisp'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertNecSp="
				INSERT INTO cpps.necertisp(ppo_no, d_o_effect, flag, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6 )
				ON CONFLICT ON CONSTRAINT necertisp_pkey
				DO UPDATE set flag=EXCLUDED.flag, sync_date=EXCLUDED.sync_date, updated_at=EXCLUDED.updated_at ";
			
			
			$resinsert=pg_prepare($con,"sqlinsertNecSp",$sqlinsertNecSp);
			$result=pg_execute($con,"sqlinsertNecSp",$data);		
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}




	function push_photo_tab($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['dno'];
			$data[2]=$param['d_o_entry'];
			$data[3]=$param['photo_type'];
			$data[4]=$param['entry_ddtls'];
			$data[5]=$param['sync_date'];
			$data[6]=date("Y-m-d H:i:s");
			$data[7]=date("Y-m-d H:i:s");
			
		 	if(!$this->check_Sync_date($param, 'photo_tab'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertPhotoTab="
				INSERT INTO cpps.photo_tab(ppo_no, dno, d_o_entry, photo_type, entry_ddtls, sync_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6 , $7, $8 )
				ON CONFLICT ON CONSTRAINT photo_tab_pkey
				DO UPDATE set dno=EXCLUDED.dno, sync_date=EXCLUDED.sync_date, updated_at=EXCLUDED.updated_at ";
			
			$resinsert=pg_prepare($con,"sqlinsertPhotoTab",$sqlinsertPhotoTab);
			$result=pg_execute($con,"sqlinsertPhotoTab",$data);
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}





	function push_monthly_pension($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			/* $val=$this->validate_param($param);
			if($val !=1){
				return $val;
			}*/
			
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]=$param['month_to'];
			$data[2]=$param['year_to'];
			$data[3]=$param['ddo_reg_no'];
			$data[4]=$param['bp'];
			$data[5]=$param['dr'];
			$data[6]=$param['ma'];
			$data[7]=$param['addn_amt'];
			$data[8]=$param['arr_amt'];
			$data[9]=$param['comm'];
			$data[10]=$param['ded_amt'];
			$data[11]=$param['net_amt'];
			$data[12]=$param['amt_type_flag'];
			$data[13]=$param['tran_id'];
			$data[14]=$param['credit_dt'];
			$data[15]=date("Y-m-d H:i:s");

			
		 	if(!$this->check_Sync_date($param, 'photo_tab'))
			{
				$returnArray = Api_Response::getResponse('313');
				return json_encode($returnArray);
			}
			
			$sqlinsertMonthlyPen="
			INSERT INTO cpps.pay_mon_pension(ppo_no, month_to, year_to, ddo_reg_no, bp, dr, ma, addn_amt, arr_amt, comm, ded_amt, net_amt, amt_type_flag, tran_id, credit_dt, created_at)
			VALUES ($1, $2, $3, $4, $5, $6 , $7, $8, $9, $10, $11, $12, $13, $14, $15, $16  )
			ON CONFLICT ON CONSTRAINT pay_mon_pension_pkey
			DO UPDATE set month_to=EXCLUDED.month_to, year_to=EXCLUDED.year_to, ddo_reg_no=EXCLUDED.ddo_reg_no, bp=EXCLUDED.bp, dr=EXCLUDED.dr, ma=EXCLUDED.ma, addn_amt=EXCLUDED.addn_amt, arr_amt=EXCLUDED.arr_amt,
			comm=EXCLUDED.comm, ded_amt=EXCLUDED.ded_amt, net_amt=EXCLUDED.net_amt, amt_type_flag=EXCLUDED.amt_type_flag,credit_dt=EXCLUDED.credit_dt,created_at=EXCLUDED.created_at ";

			
			$resinsert=pg_prepare($con,"sqlinsertMonthlyPen",$sqlinsertMonthlyPen);
			$result=pg_execute($con,"sqlinsertMonthlyPen",$data);
	   
			if($result){
				$returnArray = Api_Response::getResponse('301');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('302');
				return json_encode($returnArray);
			}
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}





	function get_profile_conversion($param){


		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			$parray=array();
			$parray[0]="06";
			$SQLGETpDEtails="select * from cpps.pensioner_profile where flag=$1";
			$RESGETpDEtails=pg_prepare($con,"SQLGETpDEtails",$SQLGETpDEtails);
			$RESULT=pg_execute($con,"SQLGETpDEtails",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['ppo_no']=$row[0];
					$data[$i]['name']=$row[1];		
					$data[$i]['d_o_birth']=$row[2];		
					$data[$i]['d_o_exp']=$row[3];		
					$data[$i]['pension_class']=$row[4];
					$data[$i]['drawer_name']=$row[5];
					$data[$i]['bank_branch']=$row[6];		
					$data[$i]['bank_accno']=$row[7];	
					$data[$i]['mob_no']=$row[8];
					$data[$i]['flag']=$row[9];						
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
			
			
			
			}
		
		}else{
				$returnArray = Api_Response::getResponse('101');
				return json_encode($returnArray);
			}
	}
	
	function get_profile_details($param){




		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			
			$parray=array();
			//$parray[0]="01";
			$parray[0]=$param['ppo_no'];
			$parray[1]=$param['flag'];

			$SQLGETpDEtails="select * from cpps.pensioner_profile where ppo_no=$1 and flag=$2";
			$RESGETpDEtails=pg_prepare($con,"SQLGETpDEtails",$SQLGETpDEtails);
			$RESULT=pg_execute($con,"SQLGETpDEtails",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['ppo_no']=$row[0];
					$data[$i]['name']=$row[1];		
					$data[$i]['d_o_birth']=$row[2];		
					$data[$i]['d_o_exp']=$row[3];		
					$data[$i]['pension_class']=$row[4];
					$data[$i]['drawer_name']=$row[5];
					$data[$i]['bank_branch']=$row[6];		
					$data[$i]['bank_accno']=$row[7];	
					$data[$i]['mob_no']=$row[8];
					$data[$i]['flag']=$row[9];						
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
			
			
			
			}
		
		}else{
				$returnArray = Api_Response::getResponse('101');
				return json_encode($returnArray);
			}
	}
	
	function push_profile_status($param){

		//return json_encode($this->validate_token($param));

		//return json_encode($param['token']);
		if($this->validate_token($param))
		{
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			$dparam=array();
			
			
			switch ($param['action']){
				case 'dlc':
						$dparam[0]=$param['process_flag'];
						$dparam[1]=date("Y-m-d H:i:s");
						$dparam[2]=$param['certificate_id'];
						$sqlUPPDLC="UPDATE cpps.facial_pensioner_dlc
						SET  process_flag=?, updated_at=?
						WHERE certificate_id=?"; 
						
						$resssqlUPPDLCC=pg_prepare($con,$sqlUPPDLC);
						$result=pg_execute($resssqlUPPDLCC,$dparam);	

				   
						if($result){
							$returnArray = Api_Response::getResponse('306');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('307');
							return json_encode($returnArray);
						}
						break;
				case 'dlcreject':
				
						$dparam[0]=date("Y-m-d H:i:s");
						$dparam[1]=$param['ppo_no'];
						
						$sqlUPPDLC="UPDATE cpps.facial_pensioner_dlc SET  process_flag='02', updated_at=? where ppo_no=? AND process_flag='01'";
						
						$resssqlUPPDLCC=pg_prepare($con,"sqlUPPDLC",$sqlUPPDLC);
						$result=pg_execute($con,"sqlUPPDLC",$dparam);	

				   
						if($result){
							$returnArray = Api_Response::getResponse('306');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('307');
							return json_encode($returnArray);
						}
						break;						
				case 'registration':
						$val=$this->validate_param($param);
						
						
						if($val !=1){
							$returnArray = Api_Response::getResponse("$val");
							return json_encode($returnArray);
						}
						$dparam[2]=$param['process_flag'];
						$dparam[3]=date("Y-m-d H:i:s");
						$dparam[0]=$param['ppo_no'];
						$dparam[1]=$param['ppo_regn_no'];
						
						
						$sqlUPPPR="UPDATE cpps.facial_pensioner_regn
						SET  process_flag=?, updated_at=?
						WHERE ppo_no=? and ppo_regn_no=?"; 
						$resssqlUPPDLCC=odbc_prepare($con,$sqlUPPPR);
						$result=odbc_execute($resssqlUPPDLCC,$dparam);	

				   
						if($result){
							$returnArray = Api_Response::getResponse('306');
							return json_encode($returnArray);
						}else{
							$returnArray = Api_Response::getResponse('307');
							return json_encode($returnArray);
						}
						break;
				default:
						$response=json_encode("Invalid Action");
						
			}
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);			
		}
		
		
		


		/*
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$data[0]=$param['ppo_no'];
			$data[1]="00";
			$data[2]=date("Y-m-d H:i:s");
			$sqlupdateProfile="UPDATE cpps.pensioner_profile SET  flag=$2, updated_at=$3
			WHERE ppo_no=$1";
			$resUpdateProfileC=pg_prepare($con,"sqlupdateProfile",$sqlupdateProfile);
			$result=pg_execute($con,"sqlupdateProfile",$data);
			if($result){
				pg_close($con);
				$returnArray = Api_Response::getResponse('306');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('307');
				return json_encode($returnArray);
			}
			
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		*/
		
		
		
	}

	function push_profile_conversion($param){

		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$data=array();
			$data[0]=$param['ppo_no'];
			$data[1]="06";
			$data[2]=date("Y-m-d H:i:s");
			
			$sqlupdateProfile="UPDATE cpps.pensioner_profile SET  flag=$2, updated_at=$3
			WHERE ppo_no=$1";
			$resUpdateProfileC=pg_prepare($con,"sqlupdateProfile",$sqlupdateProfile);
			$result=pg_execute($con,"sqlupdateProfile",$data);
			if($result){
				pg_close($con);
				$returnArray = Api_Response::getResponse('306');
				return json_encode($returnArray);
			}else{
				$returnArray = Api_Response::getResponse('307');
				return json_encode($returnArray);
			}
			
			
			
			
		}else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}
	

	function validate_param($param){
		$Arrlength= count($param);
		$keys = array_keys($param);
		for($i=0;$i<$Arrlength;$i++){
			switch($keys[$i]){
				case 'ppo_reg_no':
					if($param['ppo_reg_no']==''){
						return 303;
					}
					break;
				case 'ppo_no':
					if($param['ppo_no']==''){
						return 303;
					}
					break;
				
				
				default:
					return true;
			}
		}
	}

	
	function validate_date($sdate,$edate){		
		$dt1=explode('-',$sdate);
		$dt2=explode('-',$edate);
		$diffmonth=(int)$dt2[1]-(int)$dt1[1];
		$diffyear=(int)$dt2[0]-(int)$dt1[0];
		if(($diffmonth==0)&&($diffyear==0)){
			return true;
		}else
			return false;
		
	}
	
	//select * from pao
	function validate_IP_SubSystem($ip,$subsys){
		return true;
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
		$dbparam=array();			
		$dbparam[0]=$ip;
		$dbparam[1]=$subsys;
		$SQLSELECTIP="select count(*) from pao.gras_office_ip
					where ipaddress=$1 and 
					subsys_name=$2";
		$RESSELECTIP=pg_prepare($con,"SQLSELECTIP",$SQLSELECTIP);
		$RESULT=pg_execute($con,"SQLSELECTIP",$dbparam);
		$row=pg_fetch_row($RESULT);
		pg_close($con);
		if($row[0]>=1)
			return true;
		else
			return false;
	}
	
	function validate_IP($ip,$offfice,$subsys){
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
		$dbparam=array();			
		$dbparam[0]=$ip;
		$dbparam[1]=$offfice;
		$dbparam[2]=$subsys;
		$SQLSELECTIP="select count(*) from pao.gras_office_ip
					where ipaddress=$1 and 
					office_code=$2 and subsys_name=$3";
		$RESSELECTIP=pg_prepare($con,"SQLSELECTIP",$SQLSELECTIP);
		$RESULT=pg_execute($con,"SQLSELECTIP",$dbparam);
		$row=pg_fetch_row($RESULT);
		pg_close($con);
		if($row[0]>=1)
			return true;
		else
			return false;
	}
	

	function validate_token($param){

			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$dbparam=array();
			//$dbparam[0]=trim($param['app_key']);
			//$dbparam[1]=trim($param['token']);			
			$dbparam[0]=isset($param['app_key'])?trim($param['app_key']):'';
			$dbparam[1]=isset($param['token'])?trim($param['token']):'';



			$tscurr	=time();

			$sqlcheckToken="SELECT tstamp FROM cpps.tokens where client=$1 and token=$2";
			$rescheckToken=pg_prepare($con,"sqlCheckToken",$sqlcheckToken);
			$result=pg_execute($con,"sqlCheckToken",$dbparam);
			$row = pg_fetch_row($result); 
			pg_close($con);


			if(isset($row[0])!=''){
				$dtstamp=strtotime($row[0]);

				 if(($tscurr-$dtstamp) > 600){						
					return false;
				}else{
					return true;
				}						
			}else{
				
				return false;
			}					
			
		
	}



	/*function getMerchantCode($bank_code){
		//DATABASE CONNECT 
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
	
		$dbparam=array();
		$dbparam[0]=$bank_code;
		
		$sqlMer="SELECT  merchant_code FROM pao.gras_epay_bank WHERE bank_code = $1 ";
		$result=pg_prepare($con,"sqlMer",$sqlMer);
		$result=pg_execute($con,"sqlMer",$dbparam);
		$merchantCode=pg_fetch_object($result)->merchant_code;
		
		pg_close($con);
		return trim($merchantCode);
	}*/
		
	function WriteAccessCodeDV($param) {
		
		$PostedString="";
		
		if ($param==""){
			return;
		}
		elseif ($param==null){
			return;
		}
		
		
		
		foreach($param as $key => $value){             
				$PostedString .= $key." : ".$value." , "; 
		}
		

		date_default_timezone_set ("Asia/Calcutta");
		$str="############################################### ACCESS REPORT ############################################# \n";  
		$str=$str."Log Time :".date('d/m/Y h:i:s')."\n";
		$str=$str."POSTED VALUES   :".$PostedString."\n";
		$str=$str.="\n ############################################### END ACCESS REPORT ########################################## \n";                        

		$FilePath='C:/xampp.v7.3/htdocs/cpps_api2/log/';   //live path 
		//$FilePath='/var/www/html/cpps_api/log/';
		$dir = $FilePath;
		chdir($dir);
		
		
		$filename = "pensionfacialAuthlog".date('dmY').".txt";
		if (!$handle = fopen($filename, 'a+')) {
			echo "Cannot open file ($filename)";
		}
		if (fwrite($handle, $str) === FALSE) {
			echo "Cannot write to file ($filename)";
		}
		fclose($handle);
	}



	function photoSeq($ppo_no){
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
		$dbparam=array();			
		$dbparam[0]=$ppo_no;
		//$dbparam[1]='1';
		
		$sqlseq="SELECT coalesce(max(ppo_seq_no),0) as tcount	FROM cpps.facial_pensioner_photo where ppo_no=$1 ";
		$RESseq=pg_prepare($con,"sqlseq",$sqlseq);
		$RESULT=pg_execute($con,"sqlseq",$dbparam);
		$row=pg_fetch_row($RESULT);
		pg_close($con);
		return number_format($row[0]) + 1;
	}


	function get_penregn_status($param){
		
		
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			$parray[1]=$param['ppo_regn_no'];
			
			$SQLGETpenstatus="SELECT process_flag FROM cpps.facial_pensioner_regn where ppo_no=$1 and ppo_regn_no=$2 ";
			$RESSQLGETpenstatus=pg_prepare($con,"SQLGETpenstatus",$SQLGETpenstatus);
			$RESULT=pg_execute($con,"SQLGETpenstatus",$parray);
			$row=pg_fetch_row($RESULT);
			
			if($RESULT){
				$retData=$row[0];
				pg_close($con);
				
				//$returnArray = array('success' => true, 'process_flag' => $retData);
				$returnArray = array('process_flag' => $retData);
				return json_encode($returnArray);
			
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
		
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}


		
		
	}
	function notEmpty($param){
		
	}


	function WriteAccessCode($param) {
		//DATABASE CONNECT 
		$conn = new PgConnect();
		$con=$conn->ConnectPG();
		
		//serverip=graswebip
		$LogArray = array();
		$LogArray[0]=$param['grn'];
		$LogArray[1]=$param['bid'];
		$LogArray[2]=trim($param['amt'])==""?0:trim($param['amt']);
		$LogArray[3]=$param['prn'];
		$LogArray[4]=$this->BANKURL;
		$LogArray[5]=$this->REMOTE_ADDR;
		$LogArray[6]=$this->HOSTIP;
		$LogArray[7]=$this->SERVER_ADDR;
		$LogArray[8]=$param['paystatus'];
		$LogArray[9]=$param['bank_code'];
		$LogArray[10]=$param['paystatus'];//??
		$LogArray[11]=trim($param['TransCompletionDateTime'])==""?NULL:trim($param['TransCompletionDateTime']);
		$LogArray[12]=date("Y-m-d H:i:s");//$timestamp;
		//print_r($LogArray);
		
		$sqllog="
		INSERT INTO pao.gras_bankresponse_log(grn, bankcin, amt, prn, refererurl, clientip, serverip, graswebip, paystatus, bankcode, statflag, transcompletiondatetime, systemtimestamp)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";		
		$result=pg_prepare($con,"sqllog",$sqllog);
		$result=pg_execute($con,"sqllog",$LogArray);
		
		pg_close($con);
	}
	
	
	
	
	
	
	
	
	
	
	//--------------------------------
	//	Methods for Kiosk Bank
	//	Dated:08-March-2021
	//--------------------------------

	function get_kiosk_keycode($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ks_key'];
			
			$client_pwd=base64_decode($param['ks_pwd']);
			
			$SQLGETkey="SELECT ks_pwd FROM cpps.kiosk_key where flag='1' and ks_key=$1 ";
			$RESSQLGETPCLASS=pg_prepare($con,"SQLGETkey",$SQLGETkey);
			$RESULT=pg_execute($con,"SQLGETkey",$parray);
			$hash = pg_fetch_object($RESULT)->ks_pwd;
			//$data = pg_fetch_row($RESULT); 			
			
			if (password_verify($client_pwd, $hash)) {
				$returnArray = Api_Response::getResponse('200');
				return json_encode($returnArray);
			} 
			else {
				$returnArray = Api_Response::getResponse('100');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}
	
	

	
	function kiosk_validity($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['kiosk_ip'];
			$parray[1]=$param['mchslno'];
			
			
			$SQLKioskValid="SELECT count(mchslno) as tcount FROM cpps.kiosk_mst where status='1' and kiosk_ip=$1 and mchslno =$2 ";
			
			$RESSQLKioskValid=pg_prepare($con,"SQLKioskValid",$SQLKioskValid);
			$RESULT=pg_execute($con,"SQLKioskValid",$parray);
			$tcount = pg_fetch_object($RESULT)->tcount;
			//$data = pg_fetch_row($RESULT); 			
			
			if ($tcount>0) {

				$returnArray = array('response' => true);
				return json_encode($returnArray);
				
				//$returnArray = Api_Response::getResponse('200');
				//return json_encode($returnArray);
			} 
			else {
				$returnArray = array('response' => false);
				return json_encode($returnArray);				
				//$returnArray = Api_Response::getResponse('100');
				//return json_encode($returnArray);
			}
		}
		else{
			$returnArray = array('response' => false);
			return json_encode($returnArray);			
			//$returnArray = Api_Response::getResponse('101');
			//return json_encode($returnArray);
		}
	}


	function valid_ppo($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];

			
			
			$SQLPPOValid=" select count(ppo_no) as tcount from cpps.pensioner_profile pp where pp.ppo_no=$1 and pp.penclose_flag='N' and  coalesce(freeze_flag,'N')='N'  and (pp.rcvupto_date Is null Or pp.rcvupto_date > pp.d_o_lpdrawn) ";
			
			$RESSQLPPOValid=pg_prepare($con,"SQLPPOValid",$SQLPPOValid);
			$RESULT=pg_execute($con,"SQLPPOValid",$parray);
			$tcount = pg_fetch_object($RESULT)->tcount;

			
			if ($tcount>0) {
				$returnArray = array('response' => true);
				//$returnArray = Api_Response::getResponse('200');
				return json_encode($returnArray);
			} 
			else {
				$returnArray = array('response' => false);
				//$returnArray = Api_Response::getResponse('100');
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = array('response' => false);
			//$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
		
	}
	
	
	function get_pen_profile2($param){
		
		
		if($this->validate_token($param)){
		
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			$SQLprofile="
				 Select cast(fingerprt_id as character(18)) as ppo_id, coalesce(ppd.caddress,'') as caddress,    coalesce(ppd.mobile_no,'NA') mobile_no ,coalesce(ppd.pan_no,'NA') as pan_no, pp.penclose_flag, pp.sex, coalesce(pp.quali_service,'') as quali_service, pp.ppo_no, pp.bank_accno, TO_CHAR(d_o_lpdrawn, 'Mon')  || '/' ||cast(EXTRACT(year FROM d_o_lpdrawn) as character(4)) as year1,   
				 cast(EXTRACT(DAY FROM d_o_birth) as character(2)) || '/' || TO_CHAR(d_o_birth, 'Mon')  || '/' ||cast(EXTRACT(year FROM d_o_birth) as character(4)) as d_o_birth,
				 cast(EXTRACT(DAY FROM d_o_ret) as character(2)) || '/' || TO_CHAR(d_o_ret, 'Mon')  || '/' ||cast(EXTRACT(year FROM d_o_ret) as character(4)) as d_o_ret,
				 coalesce(pp.address,'NA') as  address, name as sname,
				 case when d_o_exp is null then name else drawer_name end as name2,
				 coalesce(pp.pension_class,0) as  pen_class_code,
				 (SELECT pdesc FROM cpps.pension_class cp where cp.pcode=pp.pension_class) as pension_class_desc,
				 bank_branch,  
				 case coalesce(penclose_flag,'N') when 'Y' then coalesce(penclosed_detail,'') else '' end as pen_closed, case when pp.d_o_exp is null then 'ser' else 'fam' end as chkfam,  cast(EXTRACT(DAY FROM CURRENT_DATE) as character(2)) || '/' || TO_CHAR(CURRENT_DATE, 'Mon')  || '/' ||cast(EXTRACT(year FROM CURRENT_DATE) as character(4)) as currentDatedb 
				 ,pp.d_o_exp, pp.treasury_code
				 from cpps.pensioner_profile pp 
				 left outer join cpps.pensioner_pdetails ppd on ppd.ppo_no=pp.ppo_no
				 left outer join cpps.fingerprint frp on frp.ppo_no=pp.ppo_no and frp.status='A'
				 where pp.ppo_no=$1 ";
			
			$RESSQLprofile=pg_prepare($con,"SQLprofile",$SQLprofile);
			$RESULT=pg_execute($con,"SQLprofile",$parray);
			
			if($RESULT){
				$data=array();
				$i=0;
				
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['ppo_id']=$row[0];
					$data[$i]['caddress']=$row[1];
					$data[$i]['mobile_no']=$row[2];
					$data[$i]['pan_no']=$row[3];
					$data[$i]['penclose_flag']=$row[4];
					$data[$i]['sex']=$row[5];
					$data[$i]['quali_service']=$row[6];
					$data[$i]['ppo_no']=$row[7];
					$data[$i]['bank_accno']=$row[8];
					$data[$i]['year1']=$row[9];
					$data[$i]['d_o_birth']=$row[10];
					$data[$i]['d_o_ret']=$row[11];
					$data[$i]['address']=$row[12];
					$data[$i]['sname']=$row[13];
					$data[$i]['name2']=$row[14];
					$data[$i]['pen_class_code']=$row[15];  //INTEGER
					$data[$i]['pension_class_desc']=$row[16];
					$data[$i]['bank_branch']=$row[17];
					//$data[$i]['bank_accno']=$row[18];
					$data[$i]['pen_closed']=$row[18];
					$data[$i]['chkfam']=$row[19];
					$data[$i]['currentDatedb']=$row[20];
					$data[$i]['d_o_exp']=$row[21]; //DATETIME
					$data[$i]['treasury_code']=$row[22]; //DATETIME
					
					
					$i++;
				}
				
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}
			else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}
		
	}	
		


	function veifyfingerprint($param){
		
		
		if($this->validate_token($param)){
		
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			$SQLVerFir=" select ppo_no, finger_imp from cpps.fingerprint where status='A' and ppo_no=$1 ";
			
			$RESSQLVerFir=pg_prepare($con,"SQLVerFir",$SQLVerFir);
			$RESULT=pg_execute($con,"SQLVerFir",$parray);
			
			if($RESULT){
				$data=array();
				$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['ppo_no']=$row[0];
					$data[$i]['finger_imp']=$row[1];
					$i++;
				}
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
			}
			else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}





	function appearance_status($param){
		
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];

			$SQLAppStatus=" select case
							 when  CURRENT_DATE>=photo_expire then 1
							 else 0
							 end as appstatus
							 from
							 (
								SELECT    (d_o_entry + interval  '1 month') as photo_expire
								FROM cpps.photo_tab pt where pt.dno=1 and   pt.ppo_no=$1
							 )
							 as zz ";
			
			
			
			
			$RESSQLAppStatus=pg_prepare($con,"SQLAppStatus",$SQLAppStatus);
			$RESULT=pg_execute($con,"SQLAppStatus",$parray);
			
			if($RESULT){
				$data=array();
				$i=0;
				$row=pg_fetch_object($RESULT)->appstatus;
				
				if ($row==1){
					$returnArray = array('response' => true);
					return json_encode($returnArray);
				}
				else{
					$returnArray = array('response' => false);
					return json_encode($returnArray);

				}
				pg_close($con);
			}
			else{
				//$returnArray = Api_Response::getResponse('304');
				$returnArray = array('response' => false);
				return json_encode($returnArray);
			}
		}
		else{
			//$returnArray = Api_Response::getResponse('101');
			$returnArray = array('response' => false);
			return json_encode($returnArray);
		}
	}
		
		

	function appearance_expire($param){
		
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];

			$SQLAppExp=" SELECT photo_expire, last_app from 
							 ( 
								 SELECT 
								 cast(EXTRACT(DAY FROM photo_expire) as character(2)) || '/' || TO_CHAR(photo_expire, 'Mon')  || '/' ||cast(EXTRACT(year FROM photo_expire) as character(4)) as photo_expire,
								 cast(EXTRACT(DAY FROM d_o_entry) as character(2)) || '/' || TO_CHAR(d_o_entry, 'Mon')  || '/' ||cast(EXTRACT(year FROM d_o_entry) as character(4)) as last_app
								 from (
								 
										select d_o_entry, (d_o_entry + (span  *  interval  '1 month')) as photo_expire from
										(
											SELECT    d_o_entry, cast(span as integer) as span FROM 	
											( 	
													SELECT     d_o_entry, (SELECT no_of_months FROM cpps.appspan  WHERE (d_o_change =  (SELECT MAX(d_o_change) from cpps.appspan))) AS span   
													FROM cpps.photo_tab   WHERE (photo_tab.ppo_no =$1) AND (dno = 1)
											)  zz
										) zz2 			 
									 ) zz3
							 ) zz4 ";
			
			
			
			
			$RESSQLAppExp=pg_prepare($con,"SQLAppExp",$SQLAppExp);
			$RESULT=pg_execute($con,"SQLAppExp",$parray);
			
			if($RESULT){
				$data=array();
				$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['photo_expire']=$row[0];
					$data[$i]['last_app']=$row[1];
					$i++;
				}
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
			}
			else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}

	
	
	
	function kioskdetails($param){


		if($this->validate_token($param)){
			
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['kiosk_ip'];
			$parray[1]=$param['mchslno'];
			
			
			$SQLKioskValid=" SELECT coalesce(kiosk_name,'') as  kiosk_name, coalesce(kiosk_location,'') as kiosk_location  
							FROM cpps.kiosk_mst where status='1' and kiosk_ip=$1 and mchslno =$2 ";
			
			$RESSQLKioskValid=pg_prepare($con,"SQLKioskValid",$SQLKioskValid);
			$RESULT=pg_execute($con,"SQLKioskValid",$parray);
			//$tcount = pg_fetch_object($RESULT)->tcount;
			//$data = pg_fetch_row($RESULT); 			
			
			if($RESULT){
				$data=array();
				$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['kiosk_name']=$row[0];
					$data[$i]['kiosk_location']=$row[1];
					$i++;
				}
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
			}
			else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
		}
	}	
	
	

	function certificateobtd($param){
		
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];
			$parray[1]=$param['ppo_no'];

			$SQLCerObtd="  select sum(ccount) as  tcount from
							 (     
								 select count(lpp.limit_code) as ccount from cpps.limit_ppolist lpp 
								 where lpp.flag='Y' and lpp.ppo_no=#1 and 
								 lpp.limit_code in
								 ('01','05','07', '08')
								 union all
								 select count(lpp.ppo_no) as ccount from cpps.necertisp lpp 
								where lpp.flag='1' and lpp.ppo_no=$2 
							 ) as zz ";
			
			$RESSQLCerObtd=pg_prepare($con,"SQLCerObtd",$SQLCerObtd);
			$RESULT=pg_execute($con,"SQLCerObtd",$parray);
			
			if($RESULT){
				$data=array();
				$row=pg_fetch_object($RESULT)->tcount;
				
				if ($row==1){
					$returnArray = array('response' => true);
					return json_encode($returnArray);
				}
				else{
					$returnArray = array('response' => false);
					return json_encode($returnArray);
				}
				pg_close($con);
			}
			else{
				$returnArray = array('response' => false);
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = array('response' => false);
			return json_encode($returnArray);
		}
	}
			
			
			

	function insertAppearance($param){
		
		
		if($this->validate_token($param)){
			
			
			try{
				
		
				$conn = new PgConnect();
				$con=$conn->ConnectPG();
				pg_query("BEGIN");//Begin Transaction

				
				$app_type="KIOSK-BANK";
				$curr_dt=new DateTime();
				$parray=array();
				$parray[0]=$param['ppo_no'];
				$parray[1]=$curr_dt->format('Y/m/d H:i:s');//date('Y/m/d H:i:s');//$curr_dt
				$parray[2]=$param['pname'];
				$parray[3]=$param['pen_class_code'];
				$parray[4]=$param['kiosklocation'];
				$parray[5]=$param['nec'];
				$parray[6]=$param['nmc'];
				If ($param['nmc'] != "0" And ($param['nec'] != "0" Or ($param['nec'] == "0" And $param['fappearn'] == true))){
					$parray[7]="0";//flag
				}
				else{
					$parray[7]="1";//flag
				}
				$parray[8]=$param['crdate'];
				$parray[9]=$param['mchslno'];
				$parray[10]=$param['ppo_id'];//fingprintid
				$parray[11]="1";//printflag
				$parray[12]=$param['treasury_code'];
				$parray[13]="1";//onoff_flag
				$parray[14]=date('Y/m/d H:i:s');//created_at
				
				//Selfcertication
				$sqlsc = "
				insert into cpps.selfcertication(ppo_no, sysdatein, pname, pen_class_code, kioskplace, nec, 
				nmc, flag, crdate, mchslno, fingprintid, printflag, treasury_code, onoff_flag, created_at) 
				values( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ";
				
				$RESSQLselfcer=pg_prepare($con,"sqlsc",$sqlsc);
				$RESULTselfcer=pg_execute($con,"sqlsc",$parray);




				$parraySync=array();
				$parraySync[0]=$parray[0];
				$parraySync[1]=$parray[1];
				$parraySync[2]=$parray[2];
				$parraySync[3]=$parray[3];
				$parraySync[4]=$parray[4];
				$parraySync[5]=$parray[5];
				$parraySync[6]=$parray[6];
				$parraySync[7]=$parray[7];
				$parraySync[8]=$parray[8];
				$parraySync[9]=$parray[9];
				$parraySync[10]=$parray[10];
				$parraySync[11]=$parray[11];
				$parraySync[12]=$parray[12];
				$parraySync[13]=$parray[13];
				$parraySync[14]=$app_type;
				//$parraySync[14]=$parray[14];
				
				
				//remarks
				//printdate
				//data_id, ppo_no, sysdatein, pname, pen_class_code, kioskplace, nec, nmc, flag, crdate, mchslno, fingprintid, printflag,  treasury_code, onoff_flag, app_type				
				//Sym_Selfcertication
				$sqlsc_sym = "
				insert into cpps.sym_selfcertication(ppo_no, sysdatein, pname, pen_class_code, kioskplace, nec, nmc, flag, 
				crdate, mchslno, fingprintid, printflag, treasury_code, onoff_flag, app_type) 
				values( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ";
				$RESSQLsc_sync=pg_prepare($con,"sqlsc_sym",$sqlsc_sym);
				$RESULTsc_sync=pg_execute($con,"sqlsc_sym",$parraySync);




				//Pensioner-Appearance
				$parrayPenApp=array();
				$parrayPenApp[0]=$param['ppo_no'];
				$SQLlastApp="SELECT  d_o_entry FROM cpps.photo_tab   WHERE (ppo_no =$1) AND (dno = 1) ";
				$RESSQLlastApp=pg_prepare($con,"SQLlastApp",$SQLlastApp);
				$RESULTlstApp=pg_execute($con,"SQLlastApp",$parrayPenApp);
				$rowlastapp=pg_fetch_object($RESULTlstApp)->d_o_entry;
				
				//pg_query("ROLLBACK");
				//return json_encode('Ok...');
				//Get Last Appearance
				//Param set value
				$fappearn=$param['fappearn'];
				
				//$de = strtotime($rowlastapp);
				$d_o_entry =new DateTime($rowlastapp);// date('Y-m-d',$de);
				
				$RESULT2=null;//appearance table
				$RESULTApprn3=null;//sync table
				If ($curr_dt > $d_o_entry && ($param['nmc'] != "0" && ($param['nec']  != "0" Or ($param['nec'] == "0" And $fappearn ==true)))){
					
					//Appearance Table
					$parrayApprn=array();
					$parrayApprn[0]=$param['ppo_no'];
					$parrayApprn[1]="1";//dno
					$parrayApprn[2]=$curr_dt->format('Y/m/d');//d_o_entry
					$parrayApprn[3]=$app_type;//"KIOSK-BANK";//photo-type
					$parrayApprn[4]=$curr_dt->format('Y/m/d H:i:s');//entry_dtls
					$parrayApprn[5]=$curr_dt->format('Y/m/d H:i:s');//created_at
					
					//Sync Table
					$parrayApprn3=array();
					$parrayApprn3[0]=$parrayApprn[0];
					$parrayApprn3[1]=$parrayApprn[1];
					$parrayApprn3[2]=$parrayApprn[2];
					$parrayApprn3[3]=$parrayApprn[3];
					$parrayApprn3[4]=$curr_dt->format('Y/m/d H:i:s');
					
					
					/*
					$sqlApprn3 = "INSERT INTO cpps.sym_photo_tab(ppo_no, dno, d_o_entry, photo_type, entry_ddtls) 
										VALUES ($1, $2, $3, $4, $5 )";
					$RESSQLApprn3=pg_prepare($con,"sqlApprn3",$sqlApprn3);
					$RESULTApprn3=pg_execute($con,"sqlApprn3",$parrayApprn3);
					*/
					
					$sql = "insert into cpps.photo_tab(ppo_no,dno,d_o_entry,photo_type, entry_ddtls, created_at) values($1, $2, $3, $4, $5, $6)";
					$RESSQLApprn=pg_prepare($con,"sql",$sql);
					$RESULT2=pg_execute($con,"sql",$parrayApprn);
					
					//Log
					$parrayclientlog=array();
					$parrayclientlog[0]=$param['treasury_code'];
					$parrayclientlog[1]=substr($param['mchslno'],0,15);
					$parrayclientlog[2]="pensioner";
					$parrayclientlog[3]=$curr_dt->format('Y/m/d H:i:s');
					$parrayclientlog[4]=substr("Update appearance for PPO NO :" . $param['ppo_no'],0,100);

					$sqlclientlog = "INSERT INTO cpps.clientkiosklog(treasury_code, ipaddress, user_id, accessdatetime, details) VALUES ($1, $2, $3, $4, $5)";
					$RESSQLpreclientlog=pg_prepare($con,"sqlclientlog",$sqlclientlog);
					$RESULTexeclientlog=pg_execute($con,"sqlclientlog",$parrayclientlog);
				}
				
				
				if($RESULTselfcer && $RESULTsc_sync && $RESULTApprn3 && $RESULT2){
					pg_query("COMMIT");
					
					$returnArray = array('response' => true);
					return json_encode($returnArray);
				}
				else{
					pg_query("ROLLBACK");
					$returnArray = array('response' => false );
					return json_encode($returnArray);
				}
				
				//connection closed
				pg_close($con);
				
			}
			catch (Exception $er){
				pg_query("ROLLBACK");
				$returnArray = array('response' => false);
				return json_encode($returnArray);
			}
		}
		else{
			$returnArray = array('response' => false);
			return json_encode($returnArray);
		}
	}	

	
	
	
	function selfcerti($param){
		
		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			$parray[0]=$param['ppo_no'];

			$SQLselfCer=" 	SELECT  case nec when '1' then 'No' when '0' then 'Yes' else 'NA' end as nec,
							case nmc when '1' then 'No' when '0' then 'Yes' else 'NA' end as nmc
							FROM CPPS.selfcertication sc1
							where sc1.sysdatein=(select max(sysdatein) from cpps.selfcertication sc2 where sc2.ppo_no=sc1.ppo_no)
							and sc1.ppo_no=$1 limit 1";
			
			$RESSQLselfCer=pg_prepare($con,"SQLselfCer",$SQLselfCer);
			$RESULT=pg_execute($con,"SQLselfCer",$parray);
			
			if($RESULT){
				
				$rsObj=pg_fetch_object($RESULT);
				$nec=$rsObj->nec;
				$nmc=$rsObj->nmc;
				pg_close($con);

				$returnArray = array('nec' => $nec, 'nmc' => $nmc);
				return json_encode($returnArray);
				
			}
			else{
				$returnArray = array('nec' => '', 'nmc' => '');
				return json_encode($returnArray);
				//$returnArray = Api_Response::getResponse('304');
				//return json_encode($returnArray);
			}
		}
		else{
			$returnArray = array('nec' => '', 'nmc' => '');
			return json_encode($returnArray);
			//$returnArray = Api_Response::getResponse('101');
			//return json_encode($returnArray);
		}
	}
	
	
	



	function get_sym_selfcertication($param){


		if($this->validate_token($param)){
			$conn = new PgConnect();
			$con=$conn->ConnectPG();
			
			$parray=array();
			//$parray[0]="01";
			
			

			$SQLGETPDLC="SELECT data_id, ppo_no, sysdatein, pname, pen_class_code, kioskplace, nec, nmc, flag, crdate, remarks, mchslno, 
						fingprintid, printflag, printdate, treasury_code, onoff_flag, app_type FROM cpps.sym_selfcertication order by data_id
						limit 500 ";
						
			$RESSQLGETPDLC=pg_prepare($con,"SQLGETPDLC",$SQLGETPDLC);
			$RESULT=pg_execute($con,"SQLGETPDLC",$parray);
			
			if($RESULT){
					$data=array();
					$i=0;
				while($row=pg_fetch_row($RESULT)){
					$data[$i]['data_id']=$row[0];
					$data[$i]['ppo_no']=$row[1];		
					$data[$i]['sysdatein']=$row[2];
					$data[$i]['pname']=$row[3];
					$data[$i]['pen_class_code']=$row[4];
					$data[$i]['kioskplace']=$row[5];
					$data[$i]['nec']=$row[6];
					$data[$i]['nmc']=$row[7];		
					$data[$i]['flag']=$row[8];		
					$data[$i]['crdate']=$row[9];		
					$data[$i]['remarks']=$row[10];
					$data[$i]['mchslno']=$row[11];
					$data[$i]['fingprintid']=$row[12];
					$data[$i]['printflag']=$row[13];
					$data[$i]['printdate']=$row[14];
					$data[$i]['treasury_code']=$row[15];
					$data[$i]['onoff_flag']=$row[16];
					$data[$i]['app_type']=$row[17];
					$i++;
				}		
				$retData=json_encode($data);
				pg_close($con);
				return $retData;
				
			}else{
				$returnArray = Api_Response::getResponse('304');
				return json_encode($returnArray);
			}
			
		}
		else{
			$returnArray = Api_Response::getResponse('101');
			return json_encode($returnArray);
			
			
			
		}



	}	

	
	
	
}
?>
