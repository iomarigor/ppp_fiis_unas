<?php

namespace App\Http\Controllers;

use App\User;
use App\UsuarioMenus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        $user = User::where('username', $request->username)
        ->where('estado','=',1) 
        -> first();
        if(!$user){
            return response()->json(['error' => 'user_not_credentials'], 500);
        }
        $user->menus= DB::table('usuario_menus as um')
        ->join('menu as m', 'um.idmenus', '=', 'm.menu_id')
        ->select('m.*')
        ->whereNull('m.padre_id')
        ->where('iduser','=',$user->id)
        ->orderBy('m.orden', 'asc')->get();  
        for($i=0;$i<count($user->menus);$i++){
            $user->menus[$i]->subMenus= DB::table('usuario_menus as um')
            ->join('menu as m', 'um.idmenus', '=', 'm.menu_id')
            ->select('m.*')
            ->whereNotNull('m.padre_id')
            ->where('m.padre_id','=',$user->menus[$i]->menu_id)
            ->where('um.iduser','=',$user->id)
            ->orderBy('m.orden', 'asc')->get();  
        }	
        return response()->json(compact('user','token'));
    }
    public function getAuthenticatedUser($path)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            	
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        if($user->estado==0){
            return response()->json(['error' => 'user_not_credentials'], 500);
        }
        $user->menus= DB::table('usuario_menus as um')
        ->join('menu as m', 'um.idmenus', '=', 'm.menu_id')
        ->select('m.*')
        ->whereNull('m.padre_id')
        ->where('iduser','=',$user->id)
        ->orderBy('m.orden', 'asc')->get();  
        for($i=0;$i<count($user->menus);$i++){
            $user->menus[$i]->subMenus= DB::table('usuario_menus as um')
            ->join('menu as m', 'um.idmenus', '=', 'm.menu_id')
            ->select('m.*')
            ->whereNotNull('m.padre_id')
            ->where('m.padre_id','=',$user->menus[$i]->menu_id)
            ->where('um.iduser','=',$user->id)
            ->orderBy('m.orden', 'asc')->get();  
        }
        $menuVal=DB::table('usuario_menus as um')
        ->join('menu as m','um.idmenus','=','m.menu_id')
        ->where('m.url','=',$path)
        ->where('um.iduser','=',$user->id)
        ->count();
        $user->pathValidate=false;
        if($menuVal>=1|| $path=='login' ||$path=='' || $path=='undefined'){
            $user->pathValidate=true;
        }
        //$user->pathValidate=($menuVal<=0)?false:true;
        return response()->json(compact('user'));
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string',
            'username'    => 'required|string|unique:users',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'username' => $request->get('username'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }
}
